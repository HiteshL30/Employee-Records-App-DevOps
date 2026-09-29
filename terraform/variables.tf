variable "ec2_instance_name" {
  description = "The name of the EC2 instance"
  type        = string
  default     = "Employee-Records-Jenkins"
}

variable "ec2_instance_type" {
  description = "The type of EC@ instance to use for the application"
  type        = string
  default     = "t3.small"
}

variable "ec2_ami_id" {
  description = "The AMI ID to use for the EC2 instance"
  type        = string
  default     = "ami-0f918f7e67a3323f0"
}

variable "ec2_key_name" {
  description = "The name of the key pair to use for the EC2 instance"
  type        = string
  default     = "employee-records-key"
}

variable "ec2_root_volume_size" {
  description = "The size of the root volume for the EC2 instance"
  type        = number
  default     = 30
}

variable "ec2_vpc_id" {
  description = "The VPC ID where the EC2 instance will be launched"
  type        = string
  default     = "vpc-0501944a2f26914e9"
}