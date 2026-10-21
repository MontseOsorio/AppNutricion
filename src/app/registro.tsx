import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { router } from 'expo-router';

export default function Registro() {
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >

      {/* Regresar */}
      <TouchableOpacity
        style={styles.regresar}
        onPress={() => router.back()}
      >
        <Text style={styles.flecha}>‹</Text>
        <Text style={styles.textoRegresar}>Regresar</Text>
      </TouchableOpacity>

      {/* Título */}
      <Text style={styles.titulo}>
        Crear una cuenta
      </Text>

      <Text style={styles.subtitulo}>
        Únete a la comunidad de TroyaFit
      </Text>

      {/* Formulario */}
      <View style={styles.formulario}>

        <Text style={styles.etiqueta}>
          Nombre completo
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Escribe tu nombre"
          placeholderTextColor="#999999"
        />
        
        <Text style={styles.etiqueta}>
          Expediente
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Expediente"
          placeholderTextColor="#999999"
        />

        <Text style={styles.etiqueta}>
          Correo electrónico
        </Text>

        <TextInput
          style={styles.input}
          placeholder="ejemplo@correo.com"
          placeholderTextColor="#999999"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.etiqueta}>
          Contraseña
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Crea una contraseña"
          placeholderTextColor="#999999"
          secureTextEntry
        />

        <Text style={styles.etiqueta}>
          Confirmar contraseña
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Repite tu contraseña"
          placeholderTextColor="#999999"
          secureTextEntry
        />

      </View>

      {/* Botón */}
      <TouchableOpacity style={styles.boton}>
        <Text style={styles.textoBoton}>
          Crear mi cuenta
        </Text>
      </TouchableOpacity>

      {/* Iniciar sesión */}
      <View style={styles.iniciar}>
        <Text style={styles.textoPregunta}>
          ¿Ya tienes una cuenta?
        </Text>

        <TouchableOpacity>
          <Text style={styles.iniciarSesion}>
            Iniciar sesión
          </Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flexGrow: 1,
    backgroundColor: '#f1e8cf',
    paddingHorizontal: 25,
    paddingTop: 45,
    paddingBottom: 30,
  },

  regresar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },

  flecha: {
    fontSize: 35,
    color: '#1F416A',
    marginRight: 5,
    marginTop: -4,
  },

  textoRegresar: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F416A',
  },

  titulo: {
    fontSize: 30,
    fontWeight: '800',
    color: '#1F416A',
    marginBottom: 8,
  },

  subtitulo: {
    fontSize: 15,
    color: '#666666',
    marginBottom: 30,
  },

  formulario: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    padding: 20,
    marginBottom: 20,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.10,
    shadowRadius: 8,

    elevation: 4,
  },

  etiqueta: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 8,
  },

  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#F8F8F8',
    borderRadius: 15,
    paddingHorizontal: 15,
    fontSize: 14,
    color: '#333333',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },

  boton: {
    width: '100%',
    backgroundColor: '#4089C0',
    paddingVertical: 16,
    borderRadius: 28,

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
    fontSize: 17,
    fontWeight: '800',
    textAlign: 'center',
  },

  iniciar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },

  textoPregunta: {
    fontSize: 13,
    color: '#666666',
    marginRight: 5,
  },

  iniciarSesion: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1F416A',
  },

});