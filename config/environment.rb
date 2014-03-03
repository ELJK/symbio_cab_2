# Load the Rails application.
require File.expand_path('../application', __FILE__)

# Mailer settings

#Depot::Application.configure do
ActionMailer::Base.delivery_method = :smtp

#ActionMailer::Base.smtp_settings = {
#    address: "mail.symbiopharm.kz",
#    port: 25,
#    domain: "cabinet.symbiopharm.kz",
#    authentication: "plain",
#    user_name: "cabinet+symbiopharm.kz",
#    password: "sn7opu8QWE",
#    enable_starttls_auto: false
#}

#ActionMailer::Base.smtp_settings = {
#    address: "smtp.gmail.com",
#    port: 587,
#    domain: "symbiopharm.kz",
#    authentication: "plain",
#    user_name: "mufortess@gmail.com",
#    password: "x4opu7hpk373",
#    enable_starttls_auto: true
#}

#ActionMailer::Base.default content_type: "text/html"
#ActionMailer::Base.raise_delivery_errors = true
#ActionMailer::Base.perform_deliveries = true

#end

#ActionMailer::Base.delivery_method = :smtp

#ActionMailer::Base.server_settings = {
#    :address => "web-c-6.neolabs.kz",
#    :port => 465,
#    :domain => "cabinet.symbiopharm.kz",
#    :authentication => :plain,
#    :user_name => "cabinet@symbiopharm.kz",
#    :password => "sn7opu8QWE",
#    :enable_starttls_auto => "true"
#}

#ActionMailer::Base.default_content_type = "text/html"
#config.action_mailer.raise_delivery_errors = true

# Initialize the Rails application.
SymbioCab::Application.initialize!

