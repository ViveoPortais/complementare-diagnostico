interface formHeaderInterface {
  contentString: string
}

export const FormHeader = ({contentString}: formHeaderInterface) => (
    <div className="mb-4 flex flex-col">
      <h2 className="text-lg md:text-xl mr-2 important-color-text">
        {contentString}
      </h2>
    </div>
  );
  