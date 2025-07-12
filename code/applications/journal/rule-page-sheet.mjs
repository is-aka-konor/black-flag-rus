const { JournalEntryPageProseMirrorSheet } = foundry.applications.sheets.journal;

/**
 * Journal entry page that displays a controls for editing rule page tooltip & type.
 */
export default class JournalRulePageSheet extends JournalEntryPageProseMirrorSheet {
	/** @override */
	static DEFAULT_OPTIONS = {
		classes: ["text", "rule"],
		includeTOC: false
	};

	/* <><><><> <><><><> <><><><> <><><><> */

	/** @override */
	static EDIT_PARTS = {
		header: super.EDIT_PARTS.header,
		content: super.EDIT_PARTS.content,
		tooltip: {
			template: "systems/black-flag/templates/journal/rule-page-edit.hbs"
		},
		footer: super.EDIT_PARTS.footer
	};

	/* <><><><> <><><><> <><><><> <><><><> */
	/*              Rendering              */
	/* <><><><> <><><><> <><><><> <><><><> */

	/** @inheritdoc */
	async _prepareContext(options) {
		const context = await super._prepareContext(options);
		context.CONFIG = CONFIG.BlackFlag;
		return context;
	}
}
