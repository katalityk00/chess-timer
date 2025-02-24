
// Créer un objet de mapping pour les fichiers audio
const soundFiles: { [key: string]: any } = {
	'db-click.wav': require('./db-click.wav'),
	'simple-click.mp3': require('./simple-click.mp3')
};

export default soundFiles;