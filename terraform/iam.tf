# IAM role for Employee Records EC2
resource "aws_iam_role" "employee_records_role" {
  name = "Employee-Records-EC2-S3-Role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"

    Statement = [
      {
        Effect = "Allow"

        Principal = {
          Service = "ec2.amazonaws.com"
        }

        Action = "sts:AssumeRole"
      }
    ]
  })
}


# Instance profile that attaches the IAM role to EC2
resource "aws_iam_instance_profile" "employee_records_profile" {
  name = "Employee-Records-EC2-S3-Profile"
  role = aws_iam_role.employee_records_role.name
}


# Allow EC2 to access the S3 bucket
resource "aws_iam_role_policy" "s3_access" {
  name = "Employee-Records-S3-Access"
  role = aws_iam_role.employee_records_role.id

  policy = jsonencode({
    Version = "2012-10-17"

    Statement = [
      {
        Effect = "Allow"

        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:ListBucket"
        ]

        Resource = [
          aws_s3_bucket.my_bucket.arn,
          "${aws_s3_bucket.my_bucket.arn}/*"
        ]
      }
    ]
  })
}