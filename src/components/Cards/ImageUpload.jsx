import { Box, Button, Flex, Image } from '@chakra-ui/react';
import { get } from 'lodash';
import { CldUploadWidget } from 'next-cloudinary';

const ImageUpload = ({ onUploadComplete, formImgUrl }) => (
  <Flex alignItems="center" flexDirection="column" gap="6px">
    {formImgUrl ? (
      <Box position="relative">
        <Image
          src={formImgUrl}
          alt="book img"
          fill
          borderRadius="4px"
          style={{
            objectFit: 'cover',
            height: '144px',
            width: '100%'
          }}
        />
      </Box>
    ) : (
      ''
    )}
    <CldUploadWidget
      uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
      options={{
        // cropping: true, //add a cropping step
        // showAdvancedOptions: true,  //add advanced options (public_id and tag)
        sources: ['local'], // restrict the upload sources to URL and local files
        multiple: false, // restrict upload to a single file
        // folder: "user_images", //upload files to the specified folder
        // tags: ["users", "profile"], //add the given tags to the uploaded files
        // context: {alt: "user_uploaded"}, //add the given context data to the uploaded files
        clientAllowedFormats: ['image'], // restrict uploading to image files only
        maxImageFileSize: 2000000, // restrict file size to less than 2MB
        maxImageWidth: 500, // Scales the image down to a width of 500 pixels before uploading
        theme: 'minimal' // change to a minimal theme
      }}
      onSuccess={(result, { widget }) => {
        onUploadComplete(get(result, 'info.url', ''));
        widget.close();
      }}>
      {({ open }) => {
        function handleOnClick() {
          if (typeof open !== 'undefined') open();
        }
        return (
          <Button
            variant="secondary_action"
            width="fit-content"
            id="upload_widget"
            onClick={() => handleOnClick()}>
            {formImgUrl ? 'Replace' : 'Upload'}
          </Button>
        );
      }}
    </CldUploadWidget>
  </Flex>
);

export default ImageUpload;
