const Command = require('../../structures/Command.js');

module.exports = class ChuckNorris extends Command {
	constructor(Atlas) {
		super(Atlas, module.exports.info);

		this.prefetcher = new this.Atlas.lib.structs.Prefetcher({
			url: 'https://api.chucknorris.io/jokes/random',
		});
		this.prefetcher.init();
	}

	async action(msg, args, { // eslint-disable-line no-unused-vars
		settings, // eslint-disable-line no-unused-vars
	}) {
		const responder = new this.Atlas.structs.Responder(msg);

		const res = await this.prefetcher.get();

		return responder.localised().text(res.body.value).send();
	}
};

module.exports.info = {
	name: 'chucknorris',
};
