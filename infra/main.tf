terraform {
  backend "s3" {
    bucket               = "holaluz-workshop-terraform"
    dynamodb_table       = "terraform-state-lock"
    key                  = "terraform.tfstate"
    region               = "eu-west-1"
    workspace_key_prefix = "workshop/cicd/main"
  }
}

data "archive_file" "zip" {
  type = "zip"
  output_path = "${path.root}/../output/lambda.zip"
  source_dir = "${path.root}/.."
  excludes = [ "infra", ".github", "output", ".git" ]
}

resource "aws_dynamodb_table" "lambda_db" {
  name           = "lambda_db"
  billing_mode   = "PROVISIONED"
  read_capacity  = 1
  write_capacity = 1
  hash_key       = "UserName"

  attribute {
    name = "UserName"
    type = "S"
  }

  attribute {
    name = "IsTest"
    type = "N"
  }

  global_secondary_index {
    name               = "IsTestIndex"
    hash_key           = "IsTest"
    write_capacity     = 1
    read_capacity      = 1
    projection_type    = "INCLUDE"
    non_key_attributes = ["UserName"]
  }

}

data "aws_iam_policy_document" "policy_dynamo" {
  statement {
    effect = "Allow"
    actions = [
     "dynamodb:BatchGetItem",
     "dynamodb:GetItem",
     "dynamodb:Query",
     "dynamodb:Scan",
     "dynamodb:BatchWriteItem",
     "dynamodb:PutItem",
     "dynamodb:UpdateItem"
    ]
    resources = [
      aws_dynamodb_table.lambda_db.arn
    ]
  }
}

data "aws_iam_policy_document" "policy" {
  statement {
    sid    = ""
    effect = "Allow"
    principals {
      identifiers = ["lambda.amazonaws.com"]
      type        = "Service"
    }
    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "iam_for_lambda" {
  name               = "iam_for_lambda"
  assume_role_policy = data.aws_iam_policy_document.policy.json
}

resource "aws_iam_role_policy" "lambda_policy" {
  name = "lambda_policy"
  role = aws_iam_role.iam_for_lambda.id

  policy = data.aws_iam_policy_document.policy_dynamo.json
}

resource "aws_lambda_function" "lambda" {
    function_name = "mi_servicio"
    filename = data.archive_file.zip.output_path
    source_code_hash = data.archive_file.zip.output_base64sha256
    role = aws_iam_role.iam_for_lambda.arn
    handler = "index.handler"
    runtime = "nodejs16.x"
}

resource "aws_api_gateway_rest_api" "lambda" {
  name        = "serverless_lambda_gw"
  description = "Terraform Serverless Application"
}

resource "aws_api_gateway_resource" "proxy" {
  rest_api_id = "${aws_api_gateway_rest_api.lambda.id}"
  parent_id   = "${aws_api_gateway_rest_api.lambda.root_resource_id}"
  path_part   = "{proxy+}"
}

resource "aws_api_gateway_method" "proxy" {
  rest_api_id   = "${aws_api_gateway_rest_api.lambda.id}"
  resource_id   = "${aws_api_gateway_resource.proxy.id}"
  http_method   = "ANY"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "lambda" {
  rest_api_id = "${aws_api_gateway_rest_api.lambda.id}"
  resource_id = "${aws_api_gateway_method.proxy.resource_id}"
  http_method = "${aws_api_gateway_method.proxy.http_method}"

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "${aws_lambda_function.lambda.invoke_arn}"
}

resource "aws_api_gateway_deployment" "this" {
  depends_on = [
    "aws_api_gateway_integration.lambda",
  ]
  rest_api_id = "${aws_api_gateway_rest_api.lambda.id}"
  stage_name  = "prod"
}

resource "aws_lambda_permission" "apigw" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = "${aws_lambda_function.lambda.function_name}"
  principal     = "apigateway.amazonaws.com"
  source_arn = "${aws_api_gateway_rest_api.lambda.execution_arn}/*/*"
}
