import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { router } from 'expo-router';

export default function Login() {
  return (
    <View style={styles.container}>

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
        ¡Bienvenido de nuevo!
      </Text>

      <Text style={styles.subtitulo}>
        Inicia sesión en tu cuenta de TroyaFit 
      </Text>

      {/* Tarjeta */}
      <View style={styles.tarjeta}>

        {/* Expediente */}
        <Text style={styles.etiqueta}>
          Expediente UAQ
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Ingresa tu expediente"
          placeholderTextColor="#999999"
          keyboardType="numeric"
        />

        <Text style={styles.ayuda}>
          Tu expediente es tu identificador como estudiante UAQ.
        </Text>

        {/* Contraseña */}
        <Text style={styles.etiqueta}>
          Contraseña
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Ingresa tu contraseña"
          placeholderTextColor="#999999"
          secureTextEntry
        />

        {/* Recuperar contraseña */}
        <TouchableOpacity style={styles.recuperar}>
          <Text style={styles.textoRecuperar}>
            ¿Olvidaste tu contraseña?
          </Text>
        </TouchableOpacity>

      </View>

    
{/* Botón */}
<TouchableOpacity
  style={styles.boton}
  onPress={() => router.push('/recordatorios')}
>
  <Text style={styles.textoBoton}>
    Iniciar sesión
  </Text>
</TouchableOpacity>



      {/* Registro */}
      <View style={styles.registro}>
        <Text style={styles.textoPregunta}>
          ¿Aún no tienes una cuenta?
        </Text>

        <TouchableOpacity
          onPress={() => router.push('/registro')}
        >
          <Text style={styles.crearCuenta}>
            Crear una cuenta
          </Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#f1e8cf',
    paddingHorizontal: 25,
    paddingTop: 45,
  },

  regresar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 35,
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
    fontSize: 29,
    fontWeight: '800',
    color: '#1F416A',
    marginBottom: 8,
  },

  subtitulo: {
    fontSize: 15,
    color: '#666666',
    marginBottom: 30,
  },

  tarjeta: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    padding: 20,

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
    height: 52,
    backgroundColor: '#F8F8F8',
    borderRadius: 15,
    paddingHorizontal: 15,
    fontSize: 14,
    color: '#333333',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    marginBottom: 8,
  },

  ayuda: {
    fontSize: 11,
    color: '#888888',
    marginBottom: 22,
    lineHeight: 16,
  },

  recuperar: {
    alignItems: 'flex-end',
    marginTop: 2,
  },

  textoRecuperar: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1F416A',
  },

  boton: {
    width: '100%',
    backgroundColor: '#4089C0',
    paddingVertical: 16,
    borderRadius: 28,
    marginTop: 20,

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

  registro: {
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

  crearCuenta: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1F416A',
  },

});