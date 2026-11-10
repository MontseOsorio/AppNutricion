
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const categorias = [
  'Todos',
  'Cereales',
  'Frutas',
  'Verduras',
  'Leguminosas',
  'Origen animal',
  'Leche',
  'Grasas',
];

const alimentos = [
  // CEREALES
  { nombre: 'Tortilla de maíz', porcion: '1 pieza', categoria: 'Cereales', emoji: '🌮' },
  { nombre: 'Tostadas horneadas', porcion: '2 piezas', categoria: 'Cereales', emoji: '🥙' },
  { nombre: 'Pan de caja', porcion: '1 rebanada', categoria: 'Cereales', emoji: '🍞' },
  { nombre: 'Arroz cocido', porcion: '⅓ taza', categoria: 'Cereales', emoji: '🍚' },
  { nombre: 'Avena cruda', porcion: '⅓ taza', categoria: 'Cereales', emoji: '🥣' },
  { nombre: 'Pasta cocida', porcion: '½ taza', categoria: 'Cereales', emoji: '🍝' },
  { nombre: 'Papa', porcion: '½ pieza', categoria: 'Cereales', emoji: '🥔' },
  { nombre: 'Palomitas naturales sin grasa', porcion: '2½ tazas', categoria: 'Cereales', emoji: '🍿' },

  // FRUTAS
  { nombre: 'Manzana', porcion: '1 pieza', categoria: 'Frutas', emoji: '🍎' },
  { nombre: 'Plátano', porcion: '½ pieza', categoria: 'Frutas', emoji: '🍌' },
  { nombre: 'Naranja', porcion: '2 piezas', categoria: 'Frutas', emoji: '🍊' },
  { nombre: 'Papaya', porcion: '1 taza', categoria: 'Frutas', emoji: '🍈' },
  { nombre: 'Melón', porcion: '1 taza', categoria: 'Frutas', emoji: '🍈' },
  { nombre: 'Fresas', porcion: '1 taza', categoria: 'Frutas', emoji: '🍓' },
  { nombre: 'Guayaba', porcion: '3 piezas', categoria: 'Frutas', emoji: '🍐' },
  { nombre: 'Pera', porcion: '½ pieza', categoria: 'Frutas', emoji: '🍐' },
  { nombre: 'Mango', porcion: '½ pieza', categoria: 'Frutas', emoji: '🥭' },

  // VERDURAS
  { nombre: 'Lechuga', porcion: '3 tazas', categoria: 'Verduras', emoji: '🥬' },
  { nombre: 'Espinaca cruda', porcion: '2 tazas', categoria: 'Verduras', emoji: '🥬' },
  { nombre: 'Nopales', porcion: '1 taza', categoria: 'Verduras', emoji: '🌵' },
  { nombre: 'Brócoli cocido', porcion: '½ taza', categoria: 'Verduras', emoji: '🥦' },
  { nombre: 'Zanahoria', porcion: '½ taza', categoria: 'Verduras', emoji: '🥕' },
  { nombre: 'Calabaza cocida', porcion: '½ taza', categoria: 'Verduras', emoji: '🎃' },
  { nombre: 'Chayote cocido', porcion: '½ taza', categoria: 'Verduras', emoji: '🥒' },
  { nombre: 'Jitomate', porcion: '1 pieza', categoria: 'Verduras', emoji: '🍅' },
  { nombre: 'Pepino', porcion: '1½ tazas', categoria: 'Verduras', emoji: '🥒' },

  // LEGUMINOSAS
  { nombre: 'Frijoles cocidos', porcion: '½ taza', categoria: 'Leguminosas', emoji: '🫘' },
  { nombre: 'Lentejas cocidas', porcion: '½ taza', categoria: 'Leguminosas', emoji: '🥣' },
  { nombre: 'Garbanzos cocidos', porcion: '½ taza', categoria: 'Leguminosas', emoji: '🫘' },
  { nombre: 'Habas cocidas', porcion: '½ taza', categoria: 'Leguminosas', emoji: '🫛' },
  { nombre: 'Alubias cocidas', porcion: '½ taza', categoria: 'Leguminosas', emoji: '🫘' },

  // ALIMENTOS DE ORIGEN ANIMAL
  { nombre: 'Pechuga de pollo', porcion: '30 g', categoria: 'Origen animal', emoji: '🍗' },
  { nombre: 'Pescado', porcion: '30 g', categoria: 'Origen animal', emoji: '🐟' },
  { nombre: 'Carne de res', porcion: '30 g', categoria: 'Origen animal', emoji: '🥩' },
  { nombre: 'Huevo entero', porcion: '1 pieza', categoria: 'Origen animal', emoji: '🥚' },
  { nombre: 'Claras de huevo', porcion: '2 piezas', categoria: 'Origen animal', emoji: '🍳' },
  { nombre: 'Jamón de pavo', porcion: '2 rebanadas delgadas', categoria: 'Origen animal', emoji: '🍖' },
  { nombre: 'Queso panela', porcion: '30 g', categoria: 'Origen animal', emoji: '🧀' },

  // LECHE Y DERIVADOS
  { nombre: 'Leche entera', porcion: '1 taza (240 ml)', categoria: 'Leche', emoji: '🥛' },
  { nombre: 'Leche descremada', porcion: '1 taza (240 ml)', categoria: 'Leche', emoji: '🥛' },
  { nombre: 'Yogur natural', porcion: '1 taza', categoria: 'Leche', emoji: '🥣' },
  { nombre: 'Yogur bajo en grasa', porcion: '¾ taza', categoria: 'Leche', emoji: '🥣' },

  // GRASAS
  { nombre: 'Aceite', porcion: '1 cucharadita', categoria: 'Grasas', emoji: '🫒' },
  { nombre: 'Mantequilla', porcion: '1 cucharadita', categoria: 'Grasas', emoji: '🧈' },
  { nombre: 'Aguacate', porcion: '⅛ pieza', categoria: 'Grasas', emoji: '🥑' },
  { nombre: 'Almendras', porcion: '10 piezas', categoria: 'Grasas', emoji: '🥜' },
  { nombre: 'Nueces', porcion: '6 mitades', categoria: 'Grasas', emoji: '🌰' },
  { nombre: 'Cacahuates', porcion: '14 piezas', categoria: 'Grasas', emoji: '🥜' },
];

export default function Equivalencias() {
  const [categoria, setCategoria] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');

  const filtrados = useMemo(() => {
    return alimentos.filter((alimento) => {
      const coincideCategoria =
        categoria === 'Todos' || alimento.categoria === categoria;

      const coincideBusqueda = alimento.nombre
        .toLowerCase()
        .includes(busqueda.toLowerCase());

      return coincideCategoria && coincideBusqueda;
    });
  }, [categoria, busqueda]);

  return (
    <ScrollView style={styles.fondo} contentContainerStyle={styles.contenedor}>
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.regresar}>‹ Regresar</Text>
      </TouchableOpacity>

      <Text style={styles.titulo}>Equivalencias de alimentos 🍎</Text>
      <Text style={styles.subtitulo}>
        Aprende a sustituir alimentos por porciones similares.
      </Text>

      <View style={styles.info}>
        <Text style={styles.infoTitulo}>¿Qué son las equivalencias?</Text>
        <Text style={styles.infoTexto}>
          Son porciones de alimentos del mismo grupo que pueden intercambiarse
          porque aportan cantidades similares de nutrimentos.
        </Text>
      </View>

      <TextInput
        style={styles.busqueda}
        placeholder="Buscar un alimento..."
        placeholderTextColor="#888"
        value={busqueda}
        onChangeText={setBusqueda}
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categorias}
      >
        {categorias.map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.botonCategoria,
              categoria === item && styles.categoriaActiva,
            ]}
            onPress={() => setCategoria(item)}
          >
            <Text
              style={[
                styles.textoCategoria,
                categoria === item && styles.textoCategoriaActivo,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.seccion}>Porciones equivalentes</Text>

      {filtrados.length > 0 ? (
        filtrados.map((alimento, index) => (
          <View style={styles.tarjeta} key={index}>
            <View style={styles.icono}>
              <Text style={styles.emoji}>{alimento.emoji}</Text>
            </View>

            <View style={styles.datos}>
              <Text style={styles.nombre}>{alimento.nombre}</Text>
              <Text style={styles.porcion}>
                Porción de referencia: {alimento.porcion}
              </Text>
              <Text style={styles.grupo}>{alimento.categoria}</Text>
            </View>
          </View>
        ))
      ) : (
        <Text style={styles.vacio}>
          No encontramos alimentos con ese nombre.
        </Text>
      )}

      <View style={styles.aviso}>
        <Text style={styles.avisoTitulo}>💡 Recuerda</Text>
        <Text style={styles.avisoTexto}>
          Las porciones son referencias generales. El tamaño, la preparación y
          la marca pueden cambiar la equivalencia. Sigue siempre las cantidades
          indicadas en tu plan de alimentación por la nutrióloga.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  fondo: {
    flex: 1,
    backgroundColor: '#F1E8CF',
  },
  contenedor: {
    padding: 20,
    paddingTop: 55,
    paddingBottom: 40,
  },
  regresar: {
    color: '#4089C0',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 20,
  },
  titulo: {
    color: '#1F416A',
    fontSize: 25,
    fontWeight: '800',
  },
  subtitulo: {
    color: '#666',
    fontSize: 14,
    marginTop: 8,
    marginBottom: 20,
  },
  info: {
    backgroundColor: '#FFFFFF',
    padding: 17,
    borderRadius: 18,
    marginBottom: 20,
  },
  infoTitulo: {
    color: '#1F416A',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 7,
  },
  infoTexto: {
    color: '#555',
    fontSize: 13,
    lineHeight: 20,
  },
  busqueda: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    fontSize: 14,
    color: '#333',
    marginBottom: 15,
  },
  categorias: {
    flexGrow: 0,
    marginBottom: 22,
  },
  botonCategoria: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 17,
    borderRadius: 20,
    marginRight: 9,
  },
  categoriaActiva: {
    backgroundColor: '#4089C0',
  },
  textoCategoria: {
    color: '#1F416A',
    fontWeight: '700',
  },
  textoCategoriaActivo: {
    color: '#FFFFFF',
  },
  seccion: {
    color: '#1F416A',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 12,
  },
  tarjeta: {
    backgroundColor: '#FFFFFF',
    borderRadius: 17,
    padding: 14,
    marginBottom: 11,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icono: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: '#F1E8CF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 13,
  },
  emoji: {
    fontSize: 25,
  },
  datos: {
    flex: 1,
  },
  nombre: {
    color: '#1F416A',
    fontSize: 15,
    fontWeight: '800',
  },
  porcion: {
    color: '#555',
    fontSize: 13,
    marginTop: 4,
  },
  grupo: {
    color: '#4089C0',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 5,
  },
  vacio: {
    color: '#666',
    textAlign: 'center',
    marginTop: 25,
  },
  aviso: {
    backgroundColor: '#E5EEF5',
    padding: 16,
    borderRadius: 17,
    marginTop: 18,
  },
  avisoTitulo: {
    color: '#1F416A',
    fontWeight: '800',
    fontSize: 15,
    marginBottom: 7,
  },
  avisoTexto: {
    color: '#44566A',
    fontSize: 12,
    lineHeight: 19,
  },
});
