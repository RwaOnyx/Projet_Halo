import { v4 } from 'uuid';
import query from '../database.js';
import formidable from 'formidable';
import fs from 'fs';

/***AFFICHER LE FORMULAIRE DE MODIFICATION */
export function updateContact(req, res) {
  const title = "Modification d'un contact"
  const action = "submit"
      let connexion=req.session.isLogged
  res.render('contactForm.ejs', { title, action,connexion });
};

export function updateContactSubmit(req, res) {

  const { id } = req.params;
  const modifContact = [];
  const modifColonne = []
  const colonne = []
  const formData = formidable({
    allowEmptyFiles: true,
    minFileSize:0
  });

  formData.parse(req, (error, fields, files) => {
    console.log(error, fields, files)
    if (error) {
      console.error(`Erreur lors de la récupération de la photo`);
      res.status(500).send('Erreur serveur');
      return;
    }
    // Récupération du chemin temporaire du fichier
    let oldPath = files.image[0].filepath;
    // Chemin vers où sera stocké le fichier
    let newPath = 'public/images/' + files.image[0].originalFilename;
    // R2cupération du nom du fichier pour le stocker en BDD
    let imageName = files.image[0].originalFilename;
    
    // Copie le fichier depuis le dossier temporaire vers le dossier de destination
    fs.copyFile(oldPath, newPath, (error) => {
        if (error) {
            console.error(`Erreur lors de la récupération de la photo`);
            res.status(500).send('Erreur serveur');
            return;
        }
    });
    const civilite=(fields.civilite[0])
    const nom=(fields.lastName[0])
    const prenom=(fields.firstName[0])
    const telephone=(fields.telephone[0])
    const email=(fields.email[0])
    const naissance=(fields.naissance[0])
    
    if (civilite !== undefined && civilite !== "" && civilite !== null) {
      modifContact.push(civilite);
      modifColonne.push("civilite = ?")
      colonne.push("Civilité")
    }
    if (nom !== undefined && nom !== "" && nom !== null) {
      modifContact.push(nom);
      modifColonne.push("nom = ?")
      colonne.push("Nom")
    }
    if (prenom !== undefined && prenom !== "" && prenom !== null) {
      modifContact.push(prenom);
      modifColonne.push("prenom = ?")
      colonne.push("Prénom")
    }
    if (telephone !== undefined && telephone !== "" && telephone !== null) {
      modifContact.push(telephone);
      modifColonne.push("telephone = ?")
      colonne.push("Téléphone")
    }
    if (email !== undefined && email !== "" && email !== null) {
      modifContact.push(email);
      modifColonne.push("email = ?")
      colonne.push("Email")
    }
    if (naissance !== undefined && naissance !== "" && naissance !== null) {
      modifContact.push(naissance);
      modifColonne.push("naissance = ?")
      colonne.push("Date de naissance")
    }
    if (imageName !== undefined && imageName !== "" && imageName !== null) {
      modifContact.push(imageName);
      modifColonne.push("image = ?")
      colonne.push("Image")
    }

    modifContact.push(id);

    query(
      `UPDATE Contacts SET ${modifColonne.join(',')} WHERE id=?;`,
      modifContact,
      (error, results) => {
        if (error) {
          console.error(`Erreur lors de l'exécution de la requête ${error}`);
          res.status(500).send('Erreur serveur');
          return;
        }
        
        res.render('contactModifier.ejs', { modifContact, colonne });
  
      }
    );

  });
}
