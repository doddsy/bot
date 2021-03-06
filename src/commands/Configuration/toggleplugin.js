const Command = require('../../structures/Command.js');

const opposites = {
	enabled: 'disabled',
	disabled: 'enabled',
};

module.exports = class extends Command {
	constructor(Atlas) {
		super(Atlas, module.exports.info);
	}

	async action(msg, args, {
		settings,
	}) {
		const responder = new this.Atlas.structs.Responder(msg, msg.lang, 'toggleplugin');

		if (!args.length) {
			return responder.error('noArgs').send();
		}

		const query = args.join(' ');

		const extra = Object.keys(settings.raw.plugins).map(name => ({
			name,
		}));

		const plugin = this.Atlas.lib.utils.nbsFuzzy([
			...extra,
			...Array.from(this.Atlas.plugins.values()),
		], ['name'], query);

		if (!plugin || plugin.name === 'Configuration') {
			return responder.error('noPlugin', query).send();
		}

		const { state } = settings.plugin(plugin.name);

		await settings.update({
			$set: {
				[`plugins.${plugin.name.toLowerCase()}.state`]: opposites[state],
			},
		});

		return responder.text('success', plugin.name, opposites[state]).send();
	}
};

module.exports.info = {
	name: 'toggleplugin',
	// pre-v8 plugins were modules
	aliases: ['tp', 'tm', 'togglemodule'],
	permissions: {
		user: {
			manageGuild: true,
		},
	},
	examples: [
		'fun',
		'configuration',
	],
	guildOnly: true,
};
