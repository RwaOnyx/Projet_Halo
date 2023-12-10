document.addEventListener("DOMContentLoaded", function() {


  function handleCheckboxChange(checkbox, bodyId) {
    checkbox.addEventListener('change', function() {
      console.log("test")
      if (this.checked) {
        document.body.setAttribute('id', bodyId);
      }
      else {
        document.body.removeAttribute('id');
      }
    });
  }

  const switchCheckboxPC = document.getElementById('switchPC');
  const switchCheckboxMobile = document.getElementById('switchMobile');

  // Utilisez la même ID pour les deux cases à cocher
  const commonBodyId = 'accessibilite';

  handleCheckboxChange(switchCheckboxPC, commonBodyId);
  handleCheckboxChange(switchCheckboxMobile, commonBodyId);
});
