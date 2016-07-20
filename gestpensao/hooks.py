# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from . import __version__ as app_version

app_name = "gestpensao"
app_title = "Gestpensao"
app_publisher = "Helio de Jesus"
app_description = "Gestao Residencial"
app_icon = "octicon octicon-file-directory"
app_color = "grey"
app_email = "hcesar@gmail.com"
app_license = "MIT"

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = "/assets/gestpensao/css/gestpensao.css"
# app_include_js = "/assets/gestpensao/js/gestpensao.js"

# include js, css files in header of web template
# web_include_css = "/assets/gestpensao/css/gestpensao.css"
# web_include_js = "/assets/gestpensao/js/gestpensao.js"

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
#	"Role": "home_page"
# }

# Website user home page (by function)
# get_website_user_home_page = "gestpensao.utils.get_home_page"

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Installation
# ------------

# before_install = "gestpensao.install.before_install"
# after_install = "gestpensao.install.after_install"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "gestpensao.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
# 	"*": {
# 		"on_update": "method",
# 		"on_cancel": "method",
# 		"on_trash": "method"
#	}
# }

# Scheduled Tasks
# ---------------

# scheduler_events = {
# 	"all": [
# 		"gestpensao.tasks.all"
# 	],
# 	"daily": [
# 		"gestpensao.tasks.daily"
# 	],
# 	"hourly": [
# 		"gestpensao.tasks.hourly"
# 	],
# 	"weekly": [
# 		"gestpensao.tasks.weekly"
# 	]
# 	"monthly": [
# 		"gestpensao.tasks.monthly"
# 	]
# }

# Testing
# -------

# before_tests = "gestpensao.install.before_tests"

# Overriding Whitelisted Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "gestpensao.event.get_events"
# }

