// Copyright (c) 2016, Helio de Jesus and contributors
// For license information, please see license.txt

var dd=cur_frm.call({method:"empresa_load",args:{"start":"moeda"}})

frappe.ui.form.on('QUARTOS', {
	onload: function(frm) {

		if (frm.doc.name != (frm.doc.numero + "-" + frm.doc.nome_quarto)){

			cur_frm.toggle_enable("status",false)
		}else if ((frm.doc.status=="Ocupado") || (frm.doc.status=="Reservado")){
			cur_frm.toggle_enable("status",false)
		}

	}
});


frappe.ui.form.on('QUARTOS','tipo_quarto',function(frm,cdt,cdn){

	quartos_('QUARTOS_TIPO',frm.doc.tipo_quarto)
	cur_frm.refresh_fields('preco')

});

var quartos_ = function(frm,cdt,cdn){
	frappe.model.with_doc(frm, cdt, function() { 
		var d = frappe.model.get_doc(frm,cdt)
		cur_frm.doc.preco = d.preco
		cur_frm.refresh_fields()


	});
}




