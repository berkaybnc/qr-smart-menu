import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

// Klasör ağacında uploads root directory'sini statik olarak hazırla
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

export const processProductImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Fotoğraf belgesi alınamadı.' });

    // Restoran kimliğini prefix olarak isme atayarak collision önleme
    const tenantPrefix = req.tenant?.slug || 'curator';
    const filename = `${tenantPrefix}-${Date.now()}.webp`;
    const outputPath = path.join(uploadsDir, filename);

    // Yüksek boyutlu formatı hafızadan alıp WebP mimarisine sıkıştır (Saniye 0 açılış garantisi)
    await sharp(req.file.buffer)
      .resize(800, 800, {
        fit: sharp.fit.inside,
        withoutEnlargement: true
      })
      .toFormat('webp')
      .webp({ quality: 80, effort: 6 }) 
      .toFile(outputPath);

    // Frontend'e gömülecek kalıcı ve statik URL bağlamı
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${filename}`;
    
    res.status(200).json({ 
        message: 'Görsel başarıyla optimize edildi',
        imageUrl 
    });
  } catch (error) {
    console.error('[Görsel Sıkıştırma Hatası]', error);
    res.status(500).json({ error: 'Sunucu görseli dijital somelye formatına dönüştüremedi.' });
  }
};
