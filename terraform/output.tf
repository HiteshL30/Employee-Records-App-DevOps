output "ec2_instance_id" {
  description = "The ID of the EC2 instance"
  value       = aws_instance.employee_records.id
}

output "ec2_instance_public_ip" {
  description = "The public IP address of the EC2 instance"
  value       = aws_instance.employee_records.public_ip
}

output "ec2_instance_private_ip" {
  description = "The private IP address of the EC2 instance"
  value       = aws_instance.employee_records.private_ip
}

output "ec2_instance_ami" {
  description = "The AMI ID of the EC2 instance"
  value       = aws_instance.employee_records.ami
}

output "ec2_security_group_id" {
  description = "The ID of the security group associated with the EC2 instance"
  value       = aws_security_group.employee_records_sg.id
}