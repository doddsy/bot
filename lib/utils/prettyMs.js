const parseMs = require('parse-ms');

// todo: support other languages (literally the only reason this is here)

const map = {
	days: 'd',
	hours: 'h',
	minutes: 'm',
	seconds: 's',
};

module.exports = (ms, {
	verbose = true,
} = {}) => {
	if (!Number.isFinite(ms)) {
		throw new TypeError('Expected a finite number');
	}

	const chunks = [];

	const add = (val, key) => {
		if (val !== 0) {
			const short = map[key];

			if (short) {
				if (verbose) {
					const text = `${val} ${key.substring(0, key.length - 1)}`;

					return chunks.push(val !== 1 ? `${text}s` : text);
				}

				return chunks.push(val + short);
			}
		}
	};

	const parsed = parseMs(ms);

	for (const key of Object.keys(parsed)) {
		add(parsed[key], key);
	}

	return chunks[0] && chunks.join(' ');
};