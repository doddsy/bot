const Command = require('../../../structures/Command.js');

module.exports = class extends Command {
	constructor(Atlas) {
		super(Atlas, module.exports.info);
	}

	async action(msg, args) {
		const responder = new this.Atlas.structs.Responder(msg);

		const { num, cleanedArgs } = this.Atlas.lib.utils.getArgNumber(args, {
			defaultNumber: 100,
		});

		if (!cleanedArgs[0]) {
			return responder.error('purge.general.invalidFilter').send();
		}

		const pattern = cleanedArgs.join(' ');

		if (num < 1) {
			return responder.text('purge.general.tooLow').send();
		}

		if (num > 100) {
			return responder.text('purge.general.tooHigh').send();
		}

		try {
			await msg.delete();
		} catch (e) {} // eslint-disable-line no-empty

		const purgeCount = await msg.channel.purge(num, m => !m.pinned && (
			this.Atlas.lib.utils.wildcard.match(pattern, m.cleanContent)
            || this.Atlas.lib.utils.wildcard.match(pattern, m.content)
		));

		if (purgeCount === 0) {
			return responder.error('purge.general.nothingPurged', msg.author.mention).send();
		}

		return responder.error('purge.general.success', msg.author.mention, purgeCount).ttl(5).send();
	}
};

module.exports.info = {
	name: 'endswith',
	examples: [
		'xd 10',
		'xd',
	],
	aliases: [
		'ending',
		'ends',
	],
	permissions: {
		user: {
			manageMessages: true,
		},
		bot: {
			manageMessages: true,
		},
	},
	guildOnly: true,
};
