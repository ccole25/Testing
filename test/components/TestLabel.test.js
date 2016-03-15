import TestLabel from "components/TestLabel";

describe("components/TestLabel", () => {
  it("renders without an issue", () => {
    const subject = <TestLabel />;
    const renderedSubject = TestUtils.renderIntoDocument(subject);
    expect(renderedSubject).to.not.equal(undefined);
  });
});
