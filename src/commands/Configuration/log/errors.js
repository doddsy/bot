const Command = require('../../../structures/Command.js');


module.exports = class Log extends Command {
	constructor(Atlas) {
		super(Atlas, module.exports.info);
	}

	async action(msg, args, { // eslint-disable-line no-unused-vars
		settings, // eslint-disable-line no-unused-vars
	}) {
		const responder = new this.Atlas.structs.Responder(msg);

		if (!args[0] || this.Atlas.constants.disableTriggers.includes(args[0].toLowerCase())) {
			await settings.update({
				'plugins.moderation.logs.error': null,
			});

			return responder.text('log.errors.disabled').send();
		}

		const query = args.join(' ');

		const channel = (new this.Atlas.structs.Fuzzy(msg.guild.channels, {
			keys: ['name', 'id', 'mention'],
		})).search(query);

		if (!channel) {
			return responder.error('log.noResults', query).send();
		}

		await settings.update({
			'plugins.moderation.logs.error': channel.id,
		});

		return responder.text('log.errors.success', channel.mention).send();
	}
};

module.exports.info = {
	name: 'errors',
	usage: 'info.log.errors.usage',
	description: 'info.log.errors.description',
	guildOnly: true,
	aliases: ['error'],
	requirements: {
		permissions: {
			user: {
				manageGuild: true,
			},
			bot: {
				manageWebhooks: true,
			},
		},
	},
};