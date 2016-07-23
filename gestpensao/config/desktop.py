# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from frappe import _

def get_data():
	return [
		{
			"module_name": "Gestpensao",
			"color": "grey",
			"icon": "octicon octicon-file-directory",
			"type": "module",
			"label": _("Gest Pensao")

			{
			"module_name":"QUARTOS",
			"doctype": "QUARTOS",
			"color": "#f39c12",
			"icon": "octicon octicon-package",
			"type": "link",
			"link": "List/QUARTOS"
			},
		}
	]
