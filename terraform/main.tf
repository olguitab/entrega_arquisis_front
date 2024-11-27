provider "aws" {
  region = "us-east-1"
}

# Crear un bucket S3 para los archivos del frontend
resource "aws_s3_bucket" "frontend_bucket" {
  bucket = "my-frontend-bucket-${random_id.bucket_id.hex}"

  tags = {
    Name        = "FrontendBucket"
    Environment = "Production"
  }
}

# Configurar el control de acceso con aws_s3_bucket_acl
resource "aws_s3_bucket_acl" "frontend_acl" {
  bucket = aws_s3_bucket.frontend_bucket.id
  acl    = "private"
}

# Habilitar versionado en el bucket
resource "aws_s3_bucket_versioning" "versioning" {
  bucket = aws_s3_bucket.frontend_bucket.id

  versioning_configuration {
    status = "Enabled"
  }
}

# Crear un Origin Access Identity (OAI) para restringir el acceso al bucket
resource "aws_cloudfront_origin_access_identity" "origin_access_identity" {
  comment = "Access to S3 bucket only via CloudFront"
}

# Configurar la política del bucket para permitir el acceso desde CloudFront
resource "aws_s3_bucket_policy" "frontend_bucket_policy" {
  bucket = aws_s3_bucket.frontend_bucket.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "AllowCloudFrontAccess"
        Effect    = "Allow"
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.frontend_bucket.arn}/*"
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = aws_cloudfront_distribution.frontend_distribution.arn
          }
        }
      }
    ]
  })
}

# Configurar la distribución de CloudFront
resource "aws_cloudfront_distribution" "frontend_distribution" {
  enabled             = true
  default_root_object = "index.html"

  origin {
    domain_name = aws_s3_bucket.frontend_bucket.bucket_regional_domain_name
    origin_id   = "S3-my-frontend-bucket"

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.origin_access_identity.cloudfront_access_identity_path
    }
  }

  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "S3-my-frontend-bucket"
    viewer_protocol_policy = "redirect-to-https"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  tags = {
    Environment = "Production"
    Application = "Frontend"
  }
}

# Generar un ID aleatorio para garantizar nombres únicos
resource "random_id" "bucket_id" {
  byte_length = 4
}

# Outputs para facilitar acceso
output "cloudfront_domain_name" {
  value = aws_cloudfront_distribution.frontend_distribution.domain_name
}

output "frontend_s3_bucket" {
  value = aws_s3_bucket.frontend_bucket.bucket
}
