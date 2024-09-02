const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const SUPABASE_URL = process.env.SUPABASE_URL;

const s3 = new S3Client({
    endpoint: process.env.ENDPOINT_S3,
    region: 'sa-east-1',
    credentials: {
        accessKeyId: process.env.KEY_ID,
        secretAccessKey: process.env.APP_KEY,
    },
    forcePathStyle: true,
    sslEnabled: false,
});

const uploadFile = async (originalName, buffer, mimetype) => {
    const nomeUnico = `${uuidv4()}${path.extname(originalName)}`;

    const command = new PutObjectCommand({
        Bucket: process.env.SUPABASE_BUCKET,
        Key: nomeUnico,
        Body: buffer,
        ContentType: mimetype,
    });

    await s3.send(command);

    const urlPublica = `${SUPABASE_URL}/storage/v1/object/public/PDV%20Imagens/${nomeUnico}`;

    return {
        url: urlPublica,
        path: nomeUnico,
    };
};

const excluirImagem = async (key) => {
    const command = new DeleteObjectCommand({
        Bucket: process.env.SUPABASE_BUCKET,
        Key: key,
    });

    await s3.send(command);
};

module.exports = {
    uploadFile,
    excluirImagem,
    s3,
};
