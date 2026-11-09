
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { router } from 'expo-router';

export default function MenuCafeteria() {
  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >

        {/* Encabezado */}
        <View style={styles.encabezado}>
          <TouchableOpacity
            style={styles.botonRegresar}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Text style={styles.flechaRegresar}>‹</Text>
          </TouchableOpacity>

          <View style={styles.titulos}>
            <Text style={styles.titulo}>
              Menú de cafetería
            </Text>

            <Text style={styles.subtitulo}>
              Descubre las opciones disponibles
            </Text>
          </View>
        </View>

        {/* Icono principal */}
        <View style={styles.contenedorIcono}>
          <View style={styles.circuloIcono}>
            <Text style={styles.iconoPrincipal}>🍽️</Text>
          </View>
        </View>

        {/* Tarjeta de menú vacío */}
        <View style={styles.tarjetaVacia}>
          <View style={styles.etiqueta}>
            <Text style={styles.textoEtiqueta}>
              MENÚ DE CAFETERÍA
            </Text>
          </View>

          <Text style={styles.tituloVacio}>
            ¡Próximamente!
          </Text>

          <Text style={styles.descripcionVacia}>
            Estamos preparando las opciones de alimentos
            disponibles en la cafetería de la universidad.
          </Text>

          <View style={styles.separador} />

          <Text style={styles.iconoVacio}>🥗</Text>

          <Text style={styles.mensajeVacio}>
            Aún no hay platillos disponibles.
          </Text>

          <Text style={styles.submensajeVacio}>
            Cuando se agregue el menú, podrás consultar
            los platillos, precios y horarios disponibles.
          </Text>
        </View>

        {/* Información adicional */}
        <View style={styles.tarjetaInformacion}>
          <View style={styles.iconoInformacion}>
            <Text style={styles.emojiInformacion}>💡</Text>
          </View>

          <View style={styles.contenidoInformacion}>
            <Text style={styles.tituloInformacion}>
              ¿Qué encontrarás aquí?
            </Text>

            <Text style={styles.textoInformacion}>
              • Platillos disponibles en cafetería.
            </Text>

            <Text style={styles.textoInformacion}>
              • Precios y horarios.
            </Text>

            <Text style={styles.textoInformacion}>
              • Información nutricional y porciones.
            </Text>

            <Text style={styles.textoInformacion}>
              • Equivalencias con tu plan alimenticio.
            </Text>
          </View>
        </View>

        {/* Mensaje final */}
        <View style={styles.mensajeFinal}>
          <Text style={styles.textoFinal}>
            TroyaFit 💙
          </Text>

          <Text style={styles.subtextoFinal}>
            Alimentación saludable también fuera de casa.
          </Text>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#f1e8cf',
  },

  scroll: {
    paddingHorizontal: 22,
    paddingTop: 45,
    paddingBottom: 35,
  },

  encabezado: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
  },

  botonRegresar: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
  },

  flechaRegresar: {
    fontSize: 32,
    color: '#4089C0',
    lineHeight: 35,
    marginTop: -4,
  },

  titulos: {
    flex: 1,
  },

  titulo: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1F416A',
  },

  subtitulo: {
    fontSize: 12,
    color: '#777777',
    marginTop: 4,
  },

  contenedorIcono: {
    alignItems: 'center',
    marginVertical: 18,
  },

  circuloIcono: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: '#dcecf8',
    justifyContent: 'center',
    alignItems: 'center',
  },

  iconoPrincipal: {
    fontSize: 55,
  },

  tarjetaVacia: {
    backgroundColor: '#FFFFFF',
    borderRadius: 23,
    padding: 22,
    alignItems: 'center',
    marginBottom: 16,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 7,
    elevation: 3,
  },

  etiqueta: {
    backgroundColor: '#e5eedf',
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 12,
    marginBottom: 15,
  },

  textoEtiqueta: {
    fontSize: 10,
    fontWeight: '800',
    color: '#55734D',
    letterSpacing: 0.7,
  },

  tituloVacio: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1F416A',
    marginBottom: 9,
  },

  descripcionVacia: {
    fontSize: 13,
    color: '#777777',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 5,
  },

  separador: {
    width: '100%',
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 20,
  },

  iconoVacio: {
    fontSize: 35,
    marginBottom: 9,
  },

  mensajeVacio: {
    fontSize: 14,
    fontWeight: '800',
    color: '#4089C0',
    textAlign: 'center',
  },

  submensajeVacio: {
    fontSize: 11,
    color: '#888888',
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 7,
  },

  tarjetaInformacion: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 17,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },

  iconoInformacion: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: '#f1e8cf',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  emojiInformacion: {
    fontSize: 20,
  },

  contenidoInformacion: {
    flex: 1,
  },

  tituloInformacion: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1F416A',
    marginBottom: 9,
  },

  textoInformacion: {
    fontSize: 11,
    color: '#666666',
    marginBottom: 7,
    lineHeight: 17,
  },

  mensajeFinal: {
    alignItems: 'center',
    marginTop: 5,
    paddingVertical: 10,
  },

  textoFinal: {
    fontSize: 14,
    fontWeight: '800',
    color: '#4089C0',
  },

  subtextoFinal: {
    fontSize: 10,
    color: '#888888',
    marginTop: 4,
    textAlign: 'center',
  },

});
