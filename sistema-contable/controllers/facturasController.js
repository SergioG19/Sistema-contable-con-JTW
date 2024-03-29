const mongoose = require('mongoose');

const FacturaSchema = new mongoose.Schema({
  id: Number,
  cliente: String,
  fecha: Date,
  total: Number
});

const Factura = mongoose.model('Factura', FacturaSchema);

class FacturasController {
  static async agregar(req, res) {
    try {
      if (req.user.role !== 'contador') {
        return res.status(403).send('Acceso denegado');
      }

      const nuevaFactura = new Factura(req.body);
      const resultado = await nuevaFactura.save();
      res.status(201).send(resultado);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  static async listar(req, res) {
    try {
      if (!req.user || req.user.role !== 'contador') {
        return res.status(403).send('Acceso denegado');
      }

      const facturas = await Factura.find();
      res.send(facturas);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  static async obtenerFacturas(req) {
    if (!req.user || req.user.role !== 'contador') {
      throw new Error('Acceso denegado');
    }

    const facturas = await Factura.find();
    return facturas;
  }

  static async editar(req, res) {
    try {
      if (req.user.role !== 'contador') {
        return res.status(403).send('Acceso denegado');
      }

      const factura = await Factura.findById(req.params.id);
      if (!factura) {
        return res.status(404).send();
      }

      if (req.body.cliente) {
        factura.cliente = req.body.cliente;
      }

      if (req.body.fecha) {
        factura.fecha = req.body.fecha;
      }

      if (req.body.total) {
        factura.total = req.body.total;
      }

      const resultado = await factura.save();
      res.send(resultado);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  static async eliminar(req, res) {
    try {
      if (req.user.role !== 'contador') {
        return res.status(403).send('Acceso denegado');
      }

      const factura = await Factura.findByIdAndDelete(req.params.id);
      if (!factura) {
        return res.status(404).send();
      }
      res.send(factura);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  static async obtenerPorId(req, res) {
    try {
      if (req.user.role !== 'contador') {
        return res.status(403).send('Acceso denegado');
      }

      const factura = await Factura.findById(req.params.id);
      if (!factura) {
        return res.status(404).send();
      }

      res.send(factura);
    } catch (error) {
      res.status(500).send(error);
    }
  }
}

module.exports = FacturasController;