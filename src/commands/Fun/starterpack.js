const Command = require('../../structures/Command.js');

module.exports = class StarterPack extends Command {
	constructor(Atlas) {
		super(Atlas, module.exports.info);

		this.reddit = new this.Atlas.lib.structs.Reddit(['starterpacks']);
	}

	async action(msg, args, { // eslint-disable-line no-unused-vars
		settings, // eslint-disable-line no-unused-vars
	}) {
		const responder = new this.Atlas.structs.Responder(msg);

		const d = await this.reddit.getImage(msg.author.id);

		return responder.embed(d.embed).send();
	}
};

module.exports.info = {
	name: 'starterpack',
	aliases: ['sp'],
	pemrissions: {
		bot: {
			embedLinks: true,
		},
	},
};
