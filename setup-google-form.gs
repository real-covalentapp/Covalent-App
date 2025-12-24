
/**
 * COVALENT FORM GENERATOR (v2)
 * 
 * TROUBLESHOOTING "NOT LETTING ME RUN":
 * 1. Click the "Run" button (the play triangle).
 * 2. A popup says "Authorization Required". Click "Review Permissions".
 * 3. Choose your Google Account.
 * 4. A screen says "Google hasn't verified this app". 
 *    -> Click "Advanced" (bottom left).
 *    -> Click "Go to Covalent Form Generator (unsafe)" (bottom).
 * 5. Click "Allow".
 * 6. Look at the "Execution log" at the bottom for your links!
 */

function onOpen() {
  const ui = SpreadsheetApp.getUi ? SpreadsheetApp.getUi() : FormApp.getUi();
  ui.createMenu('Covalent Tools')
      .addItem('Create My Form', 'createCovalentForm')
      .addToUi();
}

function createCovalentForm() {
  try {
    const form = FormApp.create('Covalent - Cohort Application');
    form.setDescription('An intentional platform for ambitious students who value depth. Please answer with intentionality.');
    
    // Section 1: Basics
    form.addSectionHeaderItem().setTitle('Section 1: Basics');
    form.addTextItem().setTitle('Full Name').setRequired(true);
    form.addTextItem().setTitle('Email Address').setRequired(true);
    form.addTextItem().setTitle('Age').setRequired(true);
    
    const gender = form.addMultipleChoiceItem();
    gender.setTitle('Gender')
      .setChoices([
        gender.createChoice('Man'),
        gender.createChoice('Woman'),
        gender.createChoice('Non-binary'),
        gender.createChoice('Other')
      ])
      .setRequired(true);

    const interested = form.addCheckboxItem();
    interested.setTitle('Interested In Matching With')
      .setChoices([
        interested.createChoice('Man'),
        interested.createChoice('Woman'),
        interested.createChoice('Non-binary')
      ])
      .setRequired(true);

    // Section 2: Culture & Depth
    form.addPageBreakItem().setTitle('Section 2: Culture & Depth');
    form.addTextItem().setTitle('Cultural Background');
    form.addScaleItem().setTitle('How important is shared cultural background?')
      .setBounds(1, 3)
      .setLabels('Not Important', 'Very Important');
      
    form.addTextItem().setTitle('Religion / Spiritual Identity');
    form.addScaleItem().setTitle('How important is shared religion?')
      .setBounds(1, 3)
      .setLabels('Not Important', 'Very Important');

    // Section 3: Education & Path
    form.addPageBreakItem().setTitle('Section 3: Education & Path');
    form.addTextItem().setTitle('Major / Field of Study').setRequired(true);
    form.addTextItem().setTitle('Graduation Year').setRequired(true);
    form.addTextItem().setTitle('Where are you moving to post-grad? (City/Detail)');

    // Section 4: Ambition & Signals
    form.addPageBreakItem().setTitle('Section 4: Ambition & Signals');
    
    const traits = form.addCheckboxItem();
    traits.setTitle('Which of these signals describe your trajectory?')
      .setChoices([
        traits.createChoice('Strong academic performance'),
        traits.createChoice('Notable leadership experience'),
        traits.createChoice('Research or technical output'),
        traits.createChoice('Entrepreneurial track record')
      ]);

    form.addTextItem().setTitle('Instagram Handle');
    form.addTextItem().setTitle('LinkedIn Profile Link');
    
    form.addParagraphTextItem()
      .setTitle('Resume Copy Paste (Major Accomplishments List)')
      .setHelpText('Paste your accomplishments or CV highlights here.')
      .setRequired(true);

    form.addParagraphTextItem()
      .setTitle('Hobbies')
      .setHelpText('What do you do for fun? Intellectual or physical pursuits.');

    form.addParagraphTextItem()
      .setTitle('Tell us more about why you are an exceptional individual')
      .setHelpText('Describe your trajectory, what makes you different, and what you aim to achieve.')
      .setRequired(true);

    // Section 5: Shared Philosophy
    form.addPageBreakItem().setTitle('Section 5: Shared Philosophy');
    form.addParagraphTextItem().setTitle('What are you looking for right now?').setRequired(true);
    form.addParagraphTextItem().setTitle('Describe your ideal intellectual partner').setRequired(true);
    form.addParagraphTextItem().setTitle('Describe an ideal first date');
    form.addParagraphTextItem().setTitle('Absolute Dealbreakers');

    // Section 6: Honor Code
    form.addPageBreakItem().setTitle('Section 6: Honor Code');
    const honor1 = form.addCheckboxItem();
    honor1.setTitle('Commitment 1')
      .setChoices([honor1.createChoice('I value quality over quantity and accept one intentional match per cycle.')])
      .setRequired(true);
      
    const honor2 = form.addCheckboxItem();
    honor2.setTitle('Commitment 2')
      .setChoices([honor2.createChoice('I will actually explore the match I receive with focus and respect.')])
      .setRequired(true);

    console.log('--- SUCCESS ---');
    console.log('Form URL: ' + form.getPublishedUrl());
    console.log('Embed Code Link (PASTE THIS IN Questionnaire.tsx): ' + form.getPublishedUrl() + '?embedded=true');
    console.log('---------------');
  } catch (e) {
    console.error('Failed to create form: ' + e.toString());
  }
}
