// Copyright (c) 2016, Helio de Jesus and contributors
// For license information, please see license.txt

frappe.ui.form.on('Alerta PBX', {
	onload: function(frm) {

		cur_frm.set_df_property("pbx_asterisk","hidden",true)
		cur_frm.set_df_property("ip_pbx","hidden",true)
		cur_frm.set_df_property("alert_reception","hidden",true)
		cur_frm.set_df_property("alert_quartos","hidden",true)

	}
});

frappe.ui.form.on('Alerta PBX', {
	refresh: function(frm) {

		if (cur_frm.doc.alert_pbx) {
			cur_frm.set_df_property("pbx_asterisk","hidden",false)
			cur_frm.set_df_property("ip_pbx","hidden",false)
			cur_frm.set_df_property("alert_reception","hidden",false)
			cur_frm.set_df_property("alert_quartos","hidden",false)
		}else{

			cur_frm.set_df_property("pbx_asterisk","hidden",true)
			cur_frm.set_df_property("ip_pbx","hidden",true)
			cur_frm.set_df_property("alert_reception","hidden",true)
			cur_frm.set_df_property("alert_quartos","hidden",true)

		}

	}
});

frappe.ui.form.on("Alerta PBX","alert_pbx",function(frm,cdt,cdn){
	if (cur_frm.doc.alert_pbx) {
		cur_frm.set_df_property("pbx_asterisk","hidden",false)
		cur_frm.set_df_property("ip_pbx","hidden",false)
		cur_frm.set_df_property("alert_reception","hidden",false)
		cur_frm.set_df_property("alert_quartos","hidden",false)
	}else{

		cur_frm.set_df_property("pbx_asterisk","hidden",true)
		cur_frm.set_df_property("ip_pbx","hidden",true)
		cur_frm.set_df_property("alert_reception","hidden",true)
		cur_frm.set_df_property("alert_quartos","hidden",true)
	}

	
});
