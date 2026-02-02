import { Parent } from "@/components/templates";

const FileConfig = () => {
  return (
    <Parent>
      <div className="flex flex-col items-center p-5 gap-2">
        <h2 className="heading2">Upload Your Files</h2>
        <p className="heading4 font-normal text-outline">
          to attach to a project
        </p>
      </div>
      <hr className="" />
      {/* <FileConfigMain /> */}
    </Parent>
  );
};

export default FileConfig;
