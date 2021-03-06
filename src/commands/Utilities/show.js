const Command = require('../../structures/Command.js');

module.exports = class extends Command {
	constructor(Atlas) {
		super(Atlas, module.exports.info);
	}

	async action(msg, args, {
		settings,
	}) {
		const responder = new this.Atlas.structs.Responder(msg);

		if (!args.length) {
			return responder.embed(this.helpEmbed(msg)).send();
		}

		// they literally did the same thing so for now this is cleaner
		return this.Atlas.commands.get('movie').execute(msg, args, {
			settings,
			override: true,
		});
	}
};

module.exports.info = {
	name: 'show',
	aliases: ['showinfo', 'showsearch', 'showdetails', 'tvshow', 'tv'],
	examples: [
		'westworld',
		'game of thrones',
	],
	permissions: {
		bot: {
			embedLinks: true,
		},
	},
};
