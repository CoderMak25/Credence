import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = path.join(__dirname, 'public', 'credence-logo.png');
const outputPath = path.join(__dirname, 'public', 'credence-logo-circle.png');

async function makeCircularIcon() {
    try {
        // Get image metadata
        const metadata = await sharp(inputPath).metadata();
        const size = Math.min(metadata.width, metadata.height);

        // Create circular mask (white circle on transparent background)
        const circularMask = Buffer.from(
            `<svg width="${size}" height="${size}">
                <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="white"/>
            </svg>`
        );

        // Process image: resize to square, apply circular mask
        await sharp(inputPath)
            .resize(size, size, { fit: 'cover', position: 'center' })
            .composite([{
                input: circularMask,
                blend: 'dest-in'
            }])
            .png()
            .toFile(outputPath);

        console.log(`✅ Created circular icon: ${outputPath}`);
        console.log(`📐 Size: ${size}x${size}px`);
    } catch (error) {
        console.error('Error:', error);
    }
}

makeCircularIcon();
