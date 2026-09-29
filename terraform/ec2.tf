
resource "aws_instance" "employee_records" {
  ami           = var.ec2_ami_id
  instance_type = var.ec2_instance_type

  key_name = var.ec2_key_name

  associate_public_ip_address = true

  vpc_security_group_ids = [
    aws_security_group.employee_records_sg.id
  ]
  user_data = file("${path.module}/scripts.sh")

  root_block_device {
    volume_size = var.ec2_root_volume_size
    volume_type = "gp3"
  }

  tags = {
    Name = var.ec2_instance_name
  }
}