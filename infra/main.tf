terraform {
}

module "app" {
    source = "./modules/app"
    source_dir = "${path.root}/.."
}
