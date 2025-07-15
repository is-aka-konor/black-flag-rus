import BlackFlagJournalEntrySheet from "./journal-entry-sheet.mjs";

/**
 * Variant of the standard journal sheet to handle custom TOC numbering.
 */
export default class BlackFlagJournalSheet extends foundry.appv1.sheets.JournalSheet {
	constructor(...args) {
		foundry.utils.logCompatibilityWarning(
			"The BlackFlagJournalSheet application has been deprecated and replaced with BlackFlagJournalEntrySheet."
		);
		super(...args);
	}

	/* <><><><> <><><><> <><><><> <><><><> */

	/** @inheritDoc */
	static get defaultOptions() {
		const options = super.defaultOptions;
		options.classes.push("black-flag");
		return options;
	}

	/* <><><><> <><><><> <><><><> <><><><> */

	/** @inheritDoc */
	_getPageData() {
		const pageData = super._getPageData();
		BlackFlagJournalEntrySheet._adjustTOCNumbering(
			this.document,
			Object.fromEntries(
				pageData.map(p => {
					p.id = p._id;
					return [p.id, p];
				})
			)
		);
		return pageData;
	}
}
