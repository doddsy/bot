const Command = require('../../structures/Command.js');

module.exports = class Donate extends Command {
	constructor(Atlas) {
		super(Atlas, module.exports.info);
	}

	action(msg) {
		const responder = new this.Atlas.structs.Responder(msg);

		responder.text('dashboard', msg.guild.id).send();
	}
};

module.exports.info = {
	name: 'dashboard',
	aliases: [
		'controlpanel',
		'panel',
	],
	permissions: {
		user: {
			manageGuild: true,
		},
	},
};