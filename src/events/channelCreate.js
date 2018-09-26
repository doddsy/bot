module.exports = class Event {
	constructor(Atlas) {
		this.Atlas = Atlas;
	}

	// fixme: not fetching audit log entries correctly
	async execute(channel) {
		const settings = channel.guild && await this.Atlas.DB.getGuild(channel.guild.id);

		if (!channel.guild || !settings.actionLogChannel) {
			return;
		}

		// todo: support localisation on this
		const type = this.Atlas.lib.utils.getChannelType(channel.type);

		const auditEntry = await this.Atlas.util.getGuildAuditEntry(channel.guild.id, channel.id, 10);

		const embed = {
			title: 'general.logs.channelCreate.title',
			color: this.Atlas.colors.get('green').decimal,
			description: ['general.logs.channelCreate.description', channel.mention, channel.name, type],
			fields: [],
			footer: {
				text: `Channel ${channel.id}`,
			},
			timestamp: new Date(),
		};

		if (channel.parentID) {
			const { name } = channel.guild.channels.get(channel.parentID);
			embed.fields.push({
				name: 'general.logs.channelCreate.category.name',
				value: name,
				inline: true,
			});
		}

		if (auditEntry) {
			embed.fields.push({
				name: 'general.logs.channelCreate.createdBy.name',
				value: auditEntry.user.tag,
				inline: true,
			});

			embed.footer.text += ` User ${auditEntry.user.id}`;
		}

		return settings.log('action', embed);
	}
};