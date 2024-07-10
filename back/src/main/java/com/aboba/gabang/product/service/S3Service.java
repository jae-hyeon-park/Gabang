package com.aboba.gabang.product.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.DeleteObjectRequest;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.model.PutObjectResult;
import com.drew.imaging.ImageMetadataReader;
import com.drew.imaging.ImageProcessingException;
import com.drew.metadata.Directory;
import com.drew.metadata.Metadata;
import com.drew.metadata.MetadataException;
import com.drew.metadata.exif.ExifIFD0Directory;
import net.coobird.thumbnailator.Thumbnails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.*;
import java.util.UUID;

@Service
public class S3Service {

    private final AmazonS3 amazonS3;

    @Value("${cloud.aws.s3.bucket}")
    private String bucketName;

    @Autowired
    public S3Service(AmazonS3 amazonS3) {
        this.amazonS3 = amazonS3;
    }

    public String uploadFile(MultipartFile multipartFile) throws IOException {
        // 파일을 서버의 로컬 저장소에 일시적으로 저장합니다.
        File file = convertMultiPartFileToFile(multipartFile);

        // S3에 업로드될 파일의 이름을 생성합니다.
        String fileName = generateFileName(multipartFile);

        // S3에 파일을 업로드합니다.
        PutObjectResult result = amazonS3.putObject(new PutObjectRequest(bucketName, fileName, file));

        // 로컬에 저장된 파일을 삭제합니다.
        file.delete();

        // 업로드된 파일의 URL을 반환합니다.
        return amazonS3.getUrl(bucketName, fileName).toString();
    }

    private File convertMultiPartFileToFile(MultipartFile multipartFile) throws IOException {
        File file = new File(multipartFile.getOriginalFilename());
        try (FileOutputStream fos = new FileOutputStream(file)) {
            fos.write(multipartFile.getBytes());
        }
        return file;
    }

    private Metadata getMetadata(InputStream inputStream) { // file에서 메타데이터 추출
        Metadata metadata;

        try {
            metadata = ImageMetadataReader.readMetadata(inputStream);
        } catch (ImageProcessingException e) {
            throw new RuntimeException(e);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        return metadata;
    }

    private Integer getOrientation(Metadata metadata){// 메타데이터에서 방향값 추출
        int orientation = 1;

        Directory directory = metadata.getFirstDirectoryOfType(ExifIFD0Directory.class);

        // directory는 있는데 그 안에 orientation값이 없을 수 있어 두개 다 체크
        if(directory != null && directory.containsTag(ExifIFD0Directory.TAG_ORIENTATION))  {
            try {
                orientation = directory.getInt(ExifIFD0Directory.TAG_ORIENTATION);
            } catch (MetadataException e) {
                throw new RuntimeException(e);
            }
        }

        return orientation;
    }

    private BufferedImage rotateImage (BufferedImage bufferedImage, int orientation) { //방향값 기준 이미지 회전

        BufferedImage rotatedImage;
        try {
            if (orientation == 6) {
                rotatedImage = Thumbnails.of(bufferedImage).scale(1.0).rotate(90).asBufferedImage();
            } else if (orientation == 3) {
                rotatedImage = Thumbnails.of(bufferedImage).scale(1.0).rotate(180).asBufferedImage();
            } else if (orientation == 8) {
                rotatedImage = Thumbnails.of(bufferedImage).scale(1.0).rotate(270).asBufferedImage();
            } else {
                rotatedImage = bufferedImage;
            }
        }catch (IOException e) {
            throw new RuntimeException(e);
        }

        return rotatedImage;
    }

    private String generateFileName(MultipartFile multiPart) {
        return UUID.randomUUID().toString() + "-" + multiPart.getOriginalFilename().replace(" ", "_");
    }

    public void deleteFileFromS3Bucket(String fileUrl) {
        String fileName = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
        amazonS3.deleteObject(new DeleteObjectRequest(bucketName, fileName));
    }
}