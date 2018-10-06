const parse = require('parse-color');
const Command = require('../../structures/Command.js');

module.exports = class AdvancedEmbed extends Command {
	constructor(Atlas) {
		super(Atlas, module.exports.info);
	}

	async action(msg, args, { // eslint-disable-line no-unused-vars
		settings, // eslint-disable-line no-unused-vars
		parsedArgs,
	}) {
		const responder = new this.Atlas.structs.Responder(msg);

		if (Array.from(Object.keys(parsedArgs)).length === 0) {
			return responder.embed(this.helpEmbed(msg)).send();
		}

		let color;
		if (parsedArgs.color || parsedArgs.colour) {
			const unparsedColor = parsedArgs.color || parsedArgs.colour;

			color = this.Atlas.colors.get(unparsedColor.trim().toLowerCase()) || parse(unparsedColor);

			console.log(color);

			if (!color.hex) {
				return responder.error('advancedembed.unsupportedColor', unparsedColor).send();
			}
		}

		const embed = {
			color: color && parseInt(color.hex.replace(/#/g, ''), 16),
			title: !parsedArgs.icon && parsedArgs.title,
			author: {
				name: parsedArgs.icon ? parsedArgs.title : parsedArgs.name,
				icon_url: parsedArgs.icon,
			},
			description: parsedArgs.description && parsedArgs.description.replace(/\\n/g, '\n'),
			fields: [],
			image: {
				url: parsedArgs.image,
			},
			thumbnail: {
				url: parsedArgs.thumbnail,
			},
			footer: {
				text: parsedArgs.footer,
			},
			timestamp: parsedArgs.timestamp && new Date(),
			url: parsedArgs.url,
		};

		// const fields = [];
		// for (const val of Object.values(preFields)) {
		// 	fields.push(val);
		// }

		const error = responder.validateEmbed(embed, false);

		if (error) {
			return responder.error('advancedembed.error', error.message).send();
		}

		return responder.localised(true).embed(embed).send();
	}
};

module.exports.info = {
	name: 'advancedembed',
	aliases: [
		'ae',
	],
	// todo: support localisation on these
	supportedFlags: [{
		name: 'description',
		placeholder: 'text',
		desc: 'Sets the embed description.',
	}, {
		name: 'title',
		placeholder: 'text',
		desc: 'Sets the embed title.',
	}, {
		name: 'url',
		placeholder: 'url',
		desc: 'Sets the URL. General rule of thumb is that if you can send it to a channel and it turns blue, it should work.',
	}, {
		name: 'icon',
		placeholder: 'image url',
		desc: 'Sets the tiny icon next to the embed title.',
	}, {
		name: 'image',
		placeholder: 'image url',
		desc: 'Sets the embed image, the big one at the bottom of the embed.',
	}, {
		name: 'color',
		placeholder: 'color',
		desc: 'Sets the embed color. Can be a name of a color, hex (`#FFFFFF`) or RGB (`255,255,255`)',
	}, {
		name: 'thumbnail',
		placeholder: 'image url',
		desc: 'Sets the large (but not largest) image that sits on the right of the embed. ',
	}, {
		name: 'footer',
		placeholder: 'text',
		desc: 'Sets the footer text.',
	}, {
		name: 'timestamp',
		desc: 'Whether or not to add a timestamp to the embed.',
	}],
};
