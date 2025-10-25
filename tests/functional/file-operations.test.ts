import test from '@lib/BaseTest';
import path from 'path';

/**
 * Functional Tests for File Operations
 * Tests file upload functionality
 */
test.describe('File Operations Tests', () => {
    test.describe('File Upload', () => {
        test.beforeEach(async ({ fileUploadPage }) => {
            await fileUploadPage.goto();
        });

        test('should display file upload page', async ({ fileUploadPage }) => {
            await fileUploadPage.expectPageHeaderToBeVisible();
            await fileUploadPage.expectFileInputToBeVisible();
            await fileUploadPage.expectUploadButtonToBeEnabled();
        });

        test('should upload a PDF file', async ({ fileUploadPage }) => {
            const filePath = path.join(process.cwd(), 'resources', 'files', 'lorem.pdf');

            await fileUploadPage.uploadFile(filePath);
            await fileUploadPage.expectUploadSuccess('lorem.pdf');
        });

        test('should upload an image file', async ({ fileUploadPage }) => {
            const filePath = path.join(process.cwd(), 'resources', 'files', 'image.jpeg');

            await fileUploadPage.uploadFile(filePath);
            await fileUploadPage.expectUploadSuccess('image.jpeg');
        });

        test('should verify uploaded file name', async ({ fileUploadPage }) => {
            const filePath = path.join(process.cwd(), 'resources', 'files', 'lorem.pdf');

            await fileUploadPage.uploadFile(filePath);

            const uploadedFileName = await fileUploadPage.getUploadedFileName();
            test.expect(uploadedFileName).toBe('lorem.pdf');
        });
    });
});

