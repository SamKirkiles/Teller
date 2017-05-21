import { TellerAppPage } from './app.po';

describe('teller-app App', () => {
  let page: TellerAppPage;

  beforeEach(() => {
    page = new TellerAppPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
