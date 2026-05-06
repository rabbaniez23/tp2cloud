# Gunakan image Python ringan
FROM python:3.9-slim

# Set working directory di dalam container
WORKDIR /app

# Salin file requirements.txt dan install dependensi
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Salin keseluruhan kode backend
COPY . .

# Ekspos port 5000 (aturan standar Flask lokal)
EXPOSE 5000

# Jalankan aplikasi server
CMD ["python", "app.py"]
