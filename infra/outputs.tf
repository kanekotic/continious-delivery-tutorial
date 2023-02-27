output "rest_api_id" {
    value = aws_api_gateway_deployment.this.rest_api_id
}

output "stage_name" {
    value = aws_api_gateway_deployment.this.stage_name
}