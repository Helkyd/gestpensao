# -*- coding: utf-8 -*-
# Copyright (c) 2015, Helio de Jesus and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe import _
from frappe.model.document import Document


def group_servicos_query(doctype,txt,searchfield,start,page_len,filters):
	print "QQQQQQQQQQQQQ " + str(frappe.db.sql("""SELECT name FROM tabSERVICOS WHERE consumo_servico='Servico'"""))
	return frappe.db.sql("""SELECT name FROM tabSERVICOS WHERE consumo_servico='Servico'""")
