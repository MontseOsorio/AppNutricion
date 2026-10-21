import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { router } from 'expo-router';

export default function DetalleCita() {
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
          >
            <Text style={styles.flechaRegresar}>‹</Text>
          </TouchableOpacity>

          <Text style={styles.titulo}>
            Detalle de la cita
          </Text>

          <View style={styles.espacio} />

        </View>

        {/* Tarjeta principal */}
        <View style={styles.tarjeta}>

          <View style={styles.iconoGrande}>
            <Text style={styles.iconoTexto}>📅</Text>
          </View>

          <Text style={styles.tituloTarjeta}>
            Cita con nutrióloga
          </Text>

          <Text style={styles.estado}>
            Cita confirmada
          </Text>

        </View>

        {/* Información de la cita */}
        <View style={styles.tarjetaInfo}>

          <Text style={styles.tituloSeccion}>
            Información de la cita
          </Text>

          <View style={styles.dato}>
            <Text style={styles.iconoDato}>📅</Text>

            <View>
              <Text style={styles.etiqueta}>
                Fecha
              </Text>

              <Text style={styles.valor}>
                Miércoles 30 de septiembre
              </Text>
            </View>
          </View>

          <View style={styles.dato}>
            <Text style={styles.iconoDato}>🕐</Text>

            <View>
              <Text style={styles.etiqueta}>
                Hora
              </Text>

              <Text style={styles.valor}>
                5:00 PM
              </Text>
            </View>
          </View>

          <View style={styles.dato}>
            <Text style={styles.iconoDato}>📍</Text>

            <View>
              <Text style={styles.etiqueta}>
                Lugar
              </Text>

              <Text style={styles.valor}>
                Facultad de Informática UAQ
              </Text>
            </View>
          </View>

        </View>

        {/* Notas */}
        <View style={styles.tarjetaNotas}>

          <Text style={styles.tituloSeccion}>
            Notas
          </Text>

          <Text style={styles.nota}>
            Llevar tu menú de la semana y cualquier
            duda que tengas.
          </Text>

        </View>

        {/* Botones */}
        <TouchableOpacity
          style={styles.botonPrincipal}
          onPress={() => {}}
        >
          <Text style={styles.textoBotonPrincipal}>
            Reagendar cita
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botonCancelar}
          onPress={() => {}}
        >
          <Text style={styles.textoCancelar}>
            Cancelar cita
          </Text>
        </TouchableOpacity>

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
    paddingBottom: 30,
  },

  encabezado: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  botonRegresar: {
    width: 40,
    height: 40,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  flechaRegresar: {
    fontSize: 30,
    color: '#4089C0',
    marginTop: -3,
  },

  titulo: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1F416A',
  },

  espacio: {
    width: 40,
  },

  tarjeta: {
    backgroundColor: '#FFFFFF',
    borderRadius: 23,
    padding: 20,
    alignItems: 'center',
    marginBottom: 14,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.10,
    shadowRadius: 8,

    elevation: 4,
  },

  iconoGrande: {
    width: 65,
    height: 65,
    borderRadius: 22,
    backgroundColor: '#dcecf8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },

  iconoTexto: {
    fontSize: 32,
  },

  tituloTarjeta: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1F416A',
    marginBottom: 5,
  },

  estado: {
    fontSize: 12,
    color: '#4089C0',
    fontWeight: '700',
  },

  tarjetaInfo: {
    backgroundColor: '#FFFFFF',
    borderRadius: 23,
    padding: 18,
    marginBottom: 14,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,

    elevation: 3,
  },

  tituloSeccion: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1F416A',
    marginBottom: 15,
  },

  dato: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },

  iconoDato: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#dcecf8',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 20,
    marginRight: 12,
  },

  etiqueta: {
    fontSize: 10,
    color: '#888888',
    marginBottom: 3,
  },

  valor: {
    fontSize: 12,
    color: '#444444',
    fontWeight: '600',
  },

  tarjetaNotas: {
    backgroundColor: '#FFFFFF',
    borderRadius: 23,
    padding: 18,
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

  nota: {
    backgroundColor: '#f5f9fc',
    borderRadius: 15,
    padding: 13,
    fontSize: 12,
    color: '#666666',
    lineHeight: 18,
  },

  botonPrincipal: {
    backgroundColor: '#4089C0',
    borderRadius: 28,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 10,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5,

    elevation: 4,
  },

  textoBotonPrincipal: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },

  botonCancelar: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#4089C0',
  },

  textoCancelar: {
    color: '#4089C0',
    fontSize: 15,
    fontWeight: '800',
  },

});