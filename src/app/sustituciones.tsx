import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { router } from 'expo-router';

export default function Sustituciones() {
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
            Sustituciones
          </Text>

          <View style={styles.espacio} />

        </View>

        <Text style={styles.subtitulo}>
          Encuentra alternativas para tus alimentos
        </Text>

        {/* Mensaje */}
        <View style={styles.mensaje}>

          <Text style={styles.iconoMensaje}>
            🥕
          </Text>

          <View style={styles.textoMensaje}>
            <Text style={styles.mensajeTitulo}>
              ¿No tienes algún ingrediente?
            </Text>

            <Text style={styles.mensajeTexto}>
              No pasa nada, encuentra una alternativa.
            </Text>
          </View>

        </View>

        {/* Atún */}
        <View style={styles.tarjeta}>

          <View style={styles.encabezadoTarjeta}>

            <View style={styles.iconoAlimento}>
              <Text style={styles.emoji}>
                🐟
              </Text>
            </View>

            <View>
              <Text style={styles.nombreAlimento}>
                Atún
              </Text>

              <Text style={styles.puedes}>
                Puedes sustituirlo por:
              </Text>
            </View>

          </View>

          <TouchableOpacity style={styles.sustituto}>
            <Text style={styles.emojiPequeno}>🥚</Text>
            <Text style={styles.textoSustituto}>Huevo</Text>
            <Text style={styles.flecha}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.sustituto}>
            <Text style={styles.emojiPequeno}>🍗</Text>
            <Text style={styles.textoSustituto}>Pollo</Text>
            <Text style={styles.flecha}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.sustituto}>
            <Text style={styles.emojiPequeno}>🫘</Text>
            <Text style={styles.textoSustituto}>Frijoles</Text>
            <Text style={styles.flecha}>›</Text>
          </TouchableOpacity>

        </View>

        {/* Huevo */}
        <View style={styles.tarjeta}>

          <View style={styles.encabezadoTarjeta}>

            <View style={styles.iconoAlimento}>
              <Text style={styles.emoji}>
                🥚
              </Text>
            </View>

            <View>
              <Text style={styles.nombreAlimento}>
                Huevo
              </Text>

              <Text style={styles.puedes}>
                Puedes sustituirlo por:
              </Text>
            </View>

          </View>

          <TouchableOpacity style={styles.sustituto}>
            <Text style={styles.emojiPequeno}>🥛</Text>
            <Text style={styles.textoSustituto}>Queso cottage</Text>
            <Text style={styles.flecha}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.sustituto}>
            <Text style={styles.emojiPequeno}>🐟</Text>
            <Text style={styles.textoSustituto}>Atún</Text>
            <Text style={styles.flecha}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.sustituto}>
            <Text style={styles.emojiPequeno}>🌱</Text>
            <Text style={styles.textoSustituto}>Tofu</Text>
            <Text style={styles.flecha}>›</Text>
          </TouchableOpacity>

        </View>

        {/* Pollo */}
        <View style={styles.tarjeta}>

          <View style={styles.encabezadoTarjeta}>

            <View style={styles.iconoAlimento}>
              <Text style={styles.emoji}>
                🍗
              </Text>
            </View>

            <View>
              <Text style={styles.nombreAlimento}>
                Pollo
              </Text>

              <Text style={styles.puedes}>
                Puedes sustituirlo por:
              </Text>
            </View>

          </View>

          <TouchableOpacity style={styles.sustituto}>
            <Text style={styles.emojiPequeno}>🐟</Text>
            <Text style={styles.textoSustituto}>Atún</Text>
            <Text style={styles.flecha}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.sustituto}>
            <Text style={styles.emojiPequeno}>🥚</Text>
            <Text style={styles.textoSustituto}>Huevo</Text>
            <Text style={styles.flecha}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.sustituto}>
            <Text style={styles.emojiPequeno}>🫘</Text>
            <Text style={styles.textoSustituto}>Frijoles</Text>
            <Text style={styles.flecha}>›</Text>
          </TouchableOpacity>

        </View>

        {/* Regresar al menú */}
        <TouchableOpacity
          style={styles.boton}
          onPress={() => router.push('/menu')}
        >
          <Text style={styles.textoBoton}>
            Ver mi menú
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
    fontSize: 23,
    fontWeight: '800',
    color: '#1F416A',
  },

  espacio: {
    width: 40,
  },

  subtitulo: {
    fontSize: 13,
    color: '#666666',
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 18,
  },

  mensaje: {
    backgroundColor: '#dcecf8',
    borderRadius: 20,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },

  iconoMensaje: {
    fontSize: 28,
    marginRight: 12,
  },

  textoMensaje: {
    flex: 1,
  },

  mensajeTitulo: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1F416A',
    marginBottom: 3,
  },

  mensajeTexto: {
    fontSize: 11,
    color: '#666666',
  },

  tarjeta: {
    backgroundColor: '#FFFFFF',
    borderRadius: 23,
    padding: 16,
    marginBottom: 13,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,

    elevation: 3,
  },

  encabezadoTarjeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  iconoAlimento: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#dcecf8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  emoji: {
    fontSize: 25,
  },

  nombreAlimento: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1F416A',
    marginBottom: 3,
  },

  puedes: {
    fontSize: 11,
    color: '#888888',
  },

  sustituto: {
    height: 42,
    backgroundColor: '#f8f8f8',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 7,
  },

  emojiPequeno: {
    fontSize: 19,
    width: 30,
  },

  textoSustituto: {
    flex: 1,
    fontSize: 12,
    color: '#555555',
    fontWeight: '600',
  },

  flecha: {
    fontSize: 24,
    color: '#4089C0',
  },

  boton: {
    backgroundColor: '#4089C0',
    borderRadius: 28,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 2,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5,

    elevation: 4,
  },

  textoBoton: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },

});