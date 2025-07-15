const { DialogV2 } = foundry.applications.api;

/**
 * Extended version of the default dialog with some additional styling and static constructors.
 */
export default class BlackFlagDialog extends DialogV2 {
	/* <><><><> <><><><> <><><><> <><><><> */
	/*              Rendering              */
	/* <><><><> <><><><> <><><><> <><><><> */

	/** @inheritDoc */
	async _renderHTML() {
		const element = await super._renderHTML();
		element
			.querySelectorAll("button")
			.forEach(button => button.classList.add(button.hasAttribute("autofocus") ? "heavy-button" : "light-button"));
		return element;
	}

	/* <><><><> <><><><> <><><><> <><><><> */
	/*           Factory Methods           */
	/* <><><><> <><><><> <><><><> <><><><> */

	/**
	 * Wrap the Dialog with an enclosing Promise which resolves or rejects when the client makes a choice.
	 * @param {object} tooltip
	 * @param {HTMLElement} tooltip.element - Element onto which to attach the tooltip.
	 * @param {DialogData} [config={}] - Data passed to the Dialog constructor.
	 * @returns {Promise} - A Promise that resolves to the chosen result.
	 */
	static async tooltipWait({ element, ...tooltipOptions }, { buttons = [], close, ...config } = {}) {
		return this.wait({ buttons, close, ...config });

		// TODO: Implement properly
		// const { promise, resolve, reject } = Promise.withResolvers();
		//
		// // Wrap buttons with Promise resolution.
		// config.buttons = foundry.utils.deepClone(buttons ?? []);
		// for (const button of config.buttons) {
		// 	const cb = button.callback;
		// 	button.callback = (event, button, dialog) => {
		// 		const result = cb instanceof Function ? cb.call(event, button, dialog) : undefined;
		// 		resolve(result === undefined ? button.action : result);
		// 	};
		// }
		//
		// // Wrap close with Promise resolution or rejection.
		// config.close = element => {
		// 	const result = close instanceof Function ? close() : undefined;
		// 	const tooltip = element.closest(".locked-tooltip");
		// 	if (tooltip) game.tooltip.dismissLockedTooltip(tooltip);
		// 	else game.tooltip.deactivate();
		// 	if (result !== undefined) resolve(result);
		// 	else reject(new Error("The Dialog was closed without a choice being made."));
		// };
		//
		// config.classes ??= [];
		// config.classes = [...config.classes ?? [], "dialog-tooltip"];
		// config.tag = "div";
		// foundry.utils.setProperty(config, "window.frame", false);
		// foundry.utils.setProperty(config, "window.positioned", false);
		//
		// // Construct the dialog.
		// const dialog = new this(config);
		// await dialog.render({ force: true });
		// game.tooltip.activate(element, {
		// 	html: dialog.element,
		// 	locked: true,
		// 	...tooltipOptions
		// });
		//
		// // TODO: Reject properly when tooltip is closed by moving mouse away
		// return promise;
	}
}
