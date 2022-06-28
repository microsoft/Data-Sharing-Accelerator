import { useRef, ChangeEvent } from 'react'
import { BlobServiceClient, AnonymousCredential } from '@azure/storage-blob';
import { initializeIcons } from '@fluentui/react/lib/Icons';
import { IIconProps, ActionButton } from '@fluentui/react';

const storageUrl = process.env.REACT_APP_STORAGE_CONNECTION_STRING || "";
const folderName = "incoming/flatfiles/";
const containerName = "cascadia-data";
const fileIcon: IIconProps = { iconName: 'FabricOpenFolderHorizontal', };

async function getContainerClient (file: File): Promise<boolean> {  
  let rtnCode = false;
  try {
      // List containers
    const blobServiceClient = new BlobServiceClient(
      // When using AnonymousCredential, following url should include a valid SAS or support public access
      storageUrl,
      new AnonymousCredential()
    );

    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(`${folderName}${file.name}`);
    const blockBlobUploadResponse = await blockBlobClient.upload(file, file.size);
    rtnCode = blockBlobUploadResponse._response.status === 201;
  }
  catch (error) {
    console.error (`Unable to get storage container `, error);
    throw error;
  }
  finally {
    return rtnCode;
  }
}

export default function UploadButton () {
  initializeIcons();
  const uploadRef = useRef<HTMLInputElement>(null)
  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    console.log('File upload input clicked...')
    if (e.target.files === null) {
      return
    }
    const file = e.target.files[0];
    try {
      if (await getContainerClient(file)) {
          console.log (`File uploaded`);
          alert ("File uploaded");
      }
    }
    catch (error) {
      console.error (`Unable to upload the file `, error);
      alert ("Unable to upload file")
      throw error;
    }
  }

  return (
    <>
      <ActionButton text="Upload file" iconProps={fileIcon} onClick={() => uploadRef.current?.click()} />

      <input
        type="file"
        ref={uploadRef}
        onChange={handleUpload}
        style={{ display: 'none' }}
      />
    </>
  )
}