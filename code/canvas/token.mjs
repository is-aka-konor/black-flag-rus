/**
 * Extended version of the base Token class to implement additional system-specific logic.
 */
export default class BlackFlagToken extends foundry.canvas.placeables.Token {
	/* <><><><> <><><><> <><><><> <><><><> */
	/*              Token Bars             */
	/* <><><><> <><><><> <><><><> <><><><> */

	/** @inheritDoc */
	_drawBar(number, bar, data) {
		if (data.attribute === "attributes.hp") return this._drawHPBar(number, bar, data);
		return super._drawBar(number, bar, data);
	}

	/* -------------------------------------------- */

	/**
	 * Draw system-specific HP bar styling.
	 * @param {number} number - The Bar number
	 * @param {PIXI.Graphics} bar - The Bar container
	 * @param {object} data - Resource data for this bar
	 * @private
	 */
	_drawHPBar(number, bar, data) {
		// Extract health data
		let { baseMax, max, temp = 0, tempMax = 0, value } = this.document.actor.system.attributes.hp;

		// Differentiate between effective maximum and displayed maximum
		max = Math.max(0, max);
		const displayMax = baseMax + (tempMax > 0 ? tempMax : 0);

		// Allocate percentages of the total
		const tempPct = Math.clamp(temp, 0, displayMax) / displayMax;
		const colorPct = Math.clamp(value, 0, max) / displayMax;
		const hpPct = Math.clamp(value, 0, max) / max;
		const hpColor = Color.fromRGB([1 - hpPct / 2, hpPct, 0]);

		// Determine colors to use
		const blk = 0x000000;
		const c = CONFIG.BlackFlag.tokenHPColors;

		// Determine the container size (logic borrowed from core)
		let s = canvas.dimensions.uiScale;
		const bw = this.w;
		const bh = 8 * (this.document.height >= 2 ? 1.5 : 1) * s;
		const bs = s;
		const bs1 = bs + s;

		// Overall bar container
		bar.clear();
		bar
			.beginFill(blk, 0.5)
			.lineStyle(bs, blk, 1.0)
			.drawRoundedRect(0, 0, bw, bh, 3 * s);

		// Temporary maximum HP
		if (tempMax > 0) {
			const pct = baseMax / max;
			bar
				.beginFill(c.tempMaxPositive, 1.0)
				.lineStyle(1, blk, 1.0)
				.drawRoundedRect(pct * bw, 0, (1 - pct) * bw, bh, 2 * s);
		}

		// Maximum HP penalty
		else if (tempMax < 0) {
			const pct = (baseMax + tempMax) / baseMax;
			bar
				.beginFill(c.tempMaxNegative, 1.0)
				.lineStyle(1, blk, 1.0)
				.drawRoundedRect(pct * bw, 0, (1 - pct) * bw, bh, 2 * s);
		}

		// Health bar
		bar
			.beginFill(hpColor, 1.0)
			.lineStyle(bs, blk, 1.0)
			.drawRoundedRect(0, 0, colorPct * bw, bh, 2 * s);

		// Temporary hit points
		if (temp > 0) {
			bar
				.beginFill(c.temp, 1.0)
				.lineStyle(0)
				.drawRoundedRect(bs1, bs1, tempPct * bw - 2 * bs1, bh - 2 * bs1, s);
		}

		// Set position
		let posY = number === 0 ? this.h - bh : 0;
		bar.position.set(0, posY);
	}
}
