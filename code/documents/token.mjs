import { staticID } from "../utils/_module.mjs";

/**
 * Extended version of `TokenDocument` class to support some system-specific functionality.
 */
export default class BlackFlagTokenDocument extends TokenDocument {
	/* <><><><> <><><><> <><><><> <><><><> */
	/*           Data Preparation          */
	/* <><><><> <><><><> <><><><> <><><><> */

	/** @inheritDoc */
	prepareData() {
		super.prepareData();
		if (!this.hasDynamicRing) return;
		let size = this.baseActor?.system.traits?.size;
		if (!this.actorLink) {
			const deltaSize = this.delta.system.traits?.size;
			if (deltaSize) size = deltaSize;
		}
		if (!size) return;
		const scale = CONFIG.BlackFlag.actorSizes[size]?.dynamicTokenScale ?? 1;
		this.texture.scaleX = this._source.texture.scaleX * scale;
		this.texture.scaleY = this._source.texture.scaleY * scale;
	}

	/* <><><><> <><><><> <><><><> <><><><> */
	/*           Ring Animations           */
	/* <><><><> <><><><> <><><><> <><><><> */

	/**
	 * Flash the token ring based on damage, healing, or temp HP.
	 * @param {string} type - The key to determine the type of flashing.
	 */
	flashRing(type) {
		if (!this.rendered) return;
		const color = CONFIG.BlackFlag.tokenRingColors[type];
		if (!color) return;
		const options = {};
		if (type === "damage") {
			options.duration = 500;
			options.easing = foundry.canvas.placeables.tokens.TokenRing.easeTwoPeaks;
		}
		this.object.ring?.flashColor(Color.from(color), options);
	}

	/* <><><><> <><><><> <><><><> <><><><> */

	/**
	 * Determine if any rings colors should be forced based on current status.
	 * @returns {{ [ring]: number, [background]: number }}
	 */
	getRingColors() {
		const colors = {};
		if (this.hasStatusEffect(CONFIG.specialStatusEffects.DEFEATED)) {
			colors.ring = CONFIG.BlackFlag.tokenRingColors.defeated;
		}
		return colors;
	}

	/* <><><><> <><><><> <><><><> <><><><> */

	/**
	 * Determine what ring effects should be applied on top of any set by flags.
	 * @returns {string[]}
	 */
	getRingEffects() {
		const e = foundry.canvas.placeables.tokens.TokenRing.effects;
		const effects = [];
		if (this.hasStatusEffect(CONFIG.specialStatusEffects.INVISIBLE)) effects.push(e.INVISIBILITY);
		else if (this === game.combat?.combatant?.token) effects.push(e.RING_GRADIENT);
		return effects;
	}

	/* <><><><> <><><><> <><><><> <><><><> */
	/*        Socket Event Handlers        */
	/* <><><><> <><><><> <><><><> <><><><> */

	/** @inheritDoc */
	_onDelete(options, userId) {
		super._onDelete(options, userId);
		const origin = this.actor?.getFlag(game.system.id, "summon.origin");
		if (origin) BlackFlag.registry.summons.untrack(origin.split(".Item.")[0], this.actor.uuid);
	}

	/* <><><><> <><><><> <><><><> <><><><> */

	/**
	 * Set up any hooks relevant to token rendering.
	 */
	static setupHooks() {
		Hooks.on("targetToken", BlackFlag.canvas.BlackFlagToken.onTargetToken);
	}
}
