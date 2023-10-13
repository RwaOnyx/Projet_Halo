import query from '../../database.js'
import formidable from 'formidable';
import bcrypt from 'bcrypt';
import path from 'path';
import fs from 'fs';
import xss from 'xss';

export function updateUser(req, res) {
    const valueUser = [
        req.session.id,
        xss(req.session.login),
        xss(req.session.email)
    ]
}
