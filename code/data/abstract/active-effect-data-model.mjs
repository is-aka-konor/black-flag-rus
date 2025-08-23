import BaseDataModel from "./base-data-model.mjs";

/**
 * Abstract base class to add some shared functionality to all of the system's custom active effect types.
 * @abstract
 */
export default class ActiveEffectDataModel extends BaseDataModel {
	/* <><><><> <><><><> <><><><> <><><><> */
	/*            Event Handlers           */
	/* <><><><> <><><><> <><><><> <><><><> */

	/**
	 * Add modifications to the core ActiveEffect config.
	 * @param {ActiveEffectConfig} app - The ActiveEffect config.
	 * @param {HTMLElement} html - The ActiveEffect config element.
	 * @param {ApplicationRenderContext} object - The app's rendering context.
	 */
	onRenderActiveEffectConfig(app, html, context) {}
}
