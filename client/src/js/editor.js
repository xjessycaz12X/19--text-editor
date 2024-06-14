import { getDb, addNewEntry, updateEntry } from './database';
import { header } from './header';

export default class {
  constructor() {
    this.isDirty = false; // Indicates if any changes were made
    this.entries = [];
    this.currentEntryId = null;
    this.lastSavedContent = ''; // To track the last saved state of the editor

    if (typeof CodeMirror === 'undefined') {
      throw new Error('CodeMirror is not loaded');
    }

    this.editor = CodeMirror(document.querySelector('#main'), {
      value: header,
      mode: 'javascript',
      theme: 'monokai',
      lineNumbers: true,
      lineWrapping: true,
      autofocus: true,
      indentUnit: 0,
      tabSize: 2,
    });

    // Initial load of entries
    this.loadEntries();

    // Set up editor change handler
    this.editor.on('change', () => {
      localStorage.setItem('content', this.editor.getValue());
      this.isDirty = true;
    });
    // Set up editor blur handler
    this.editor.on('blur', () => {
      if (this.isDirty) {
        this.saveOrUpdateEntry();
        this.isDirty = false;
      }
    });
    // If unsaved changes are detected, save those changes
    window.addEventListener('beforeunload', () => {
      if (this.isDirty) {
        this.saveOrUpdateEntry();
      }
    });
  }
  // Load all entries from the database
  loadEntries() {
    getDb().then(data => {
      this.entries = data;
      const contents = this.entries.map(entry => entry.content).join('\n\n');
      this.editor.setValue(`${header}\n${contents}`);
      this.lastSavedContent = this.editor.getValue(); // Set lastSavedContent to the exact content of the editor after load
    }).catch(error => {
      console.error('Error loading entries: ', error);
      this.editor.setValue(header);
    });
  }

  saveOrUpdateEntry() {
    const currentContent = this.editor.getValue();

    // Check if there are actual changes made
    if (currentContent === this.lastSavedContent) {
      return; // If no changes were made, do not save or update
    }

    // Proceed to save or update logic
    const currentContentArray = currentContent.replace(`${header}\n`, '').trim().split('\n\n');
    // Prepare an array of previously saved content for comparison
    const existingContentArray = this.lastSavedContent ? this.lastSavedContent.replace(`${header}\n`, '').trim().split('\n\n') : [];
    // Iterate over each entry in the 'currentContentArray' to update existing entries or add new ones
    currentContentArray.forEach((content, index) => {
      // Check if there's a corresponding entry in the array and if it's different from the stored content proceed to update the entry
        if (existingContentArray[index] && content !== existingContentArray[index] && this.entries[index]) {
            updateEntry(this.entries[index].id, content).then(() => {
                console.log(`Updated entry with ID: ${this.entries[index].id}`);
                this.entries[index].content = content; // Update local array
            }).catch(error => {
                console.error('Failed to update entry:', error);
            });
            // If no corresponding entry exists in the database already, add the data as a new entry
        } else if (!existingContentArray[index]) {
            addNewEntry(content).then(id => {
                console.log('New entry saved with ID:', id);
                this.entries.push({ id, content });
            }).catch(error => {
                console.error('Failed to add new entry:', error);
            });
        }
    });

    // Update the last saved content and reset dirty state
    this.lastSavedContent = currentContent;
    this.isDirty = false; // Reset the dirty flag after saving
  }
}
